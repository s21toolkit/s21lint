import { Linter } from "@/linter"
import { printDiagnostic } from "@/output"
import { createParser } from "@/parser"
import { rules } from "@/rules"
import { command, rest } from "cmd-ts"
import fg from "fast-glob"
import { readFile } from "node:fs/promises"

export const s21lintCommand = command({
	name: "s21lint",
	description: "C/C++ linter for school 21 projects",
	args: {
		pathsOrPatterns: rest({
			displayName: "files",
			description: "Files to check",
		}),
	},
	async handler(argv) {
		const { pathsOrPatterns } = argv

		if (pathsOrPatterns.length === 0) {
			process.exitCode = 1

			console.log("No input files")

			return
		}

		const resolvedPaths = (await fg(pathsOrPatterns)).filter((file) =>
			/\.(c|cc|cpp|cxx|h|hh|hxx|hpp)$/.test(file),
		)

		if (resolvedPaths.length === 0) {
			process.exitCode = 1

			console.log("No resolved input files")

			return
		}

		const parser = createParser("cpp")

		const linter = new Linter({ rules })

		for (const path of resolvedPaths) {
			const content = await readFile(path, "utf8")

			const program = parser.parse(content)

			linter.checkProgram(program, path)

			for (const diagnostic of linter.getFileDiagnostics(path)) {
				printDiagnostic(path, content, diagnostic)
			}
		}

		if (!linter.ok()) {
			process.exitCode = 1

			const diagnosticCount = Array.from(linter.getDiagnostics())
				.map(([, diagnostics]) => diagnostics.length)
				.reduce((a, b) => a + b)

			const erroneousFilesCount = linter.getDiagnostics().size

			console.log(
				`Found ${diagnosticCount} errors in ${erroneousFilesCount}/${resolvedPaths.length} files`,
			)
		} else {
			console.log("No errors found")
		}
	},
})
