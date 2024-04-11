import { readFile } from "node:fs/promises"
import { Linter } from "@/linter"
import { printDiagnostic } from "@/output"
import { createParser } from "@/parser"
import { rules } from "@/rules"
import chalk from "chalk"
import { command, rest } from "cmd-ts"
import { oneLine } from "common-tags"
import fg from "fast-glob"

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
		if (!linter.hasDiagnostics()) {
			console.log(`No errors found in ${resolvedPaths.length} files`)

			return
		}

		if (linter.hasErrors()) {
			process.exitCode = 1
		}

		const stats = linter.getStats()

		const erroneousFileCount = new Set([
			...linter.diagnostics.errors.keys(),
			...linter.diagnostics.warnings.keys(),
		]).size

		console.log(oneLine`
			Found
			${chalk.red(`${stats.errors} errors`)}
			and ${chalk.yellow(`${stats.warnings} warnings`)}
			in ${erroneousFileCount}/${resolvedPaths.length} files
		`)
	},
})
