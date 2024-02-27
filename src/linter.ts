import type Parser from "web-tree-sitter"
import type { Rule } from "./rule"
import type { Diagnostic } from "./diagnostic"

export class Linter {
	readonly #diagnostics = new Map<string, Diagnostic[]>()

	constructor(
		readonly configuration: {
			rules: Rule[]
		},
	) {}

	emitDiagnostic(filename: string, diagnostic: Diagnostic) {
		if (!this.#diagnostics.has(filename)) {
			this.#diagnostics.set(filename, [diagnostic])
		} else {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			this.#diagnostics.get(filename)!.push(diagnostic)
		}
	}

	checkProgram(program: Parser.Tree, filename = "default") {
		const context = {
			node: program.rootNode,
			tree: program,
			language: program.getLanguage(),
		}

		for (const rule of this.configuration.rules) {
			const shouldCheck = rule.filter?.(context)

			if (shouldCheck === false) {
				continue
			}

			rule.check({
				...context,
				warn: (node, message) =>
					this.emitDiagnostic(filename, {
						node,
						message,
						reporter: rule,
						severity: "warning",
					}),
				error: (node, message) =>
					this.emitDiagnostic(filename, {
						node,
						message,
						reporter: rule,
						severity: "error",
					}),
			})
		}
	}

	getFileDiagnostics(filename: string) {
		return this.#diagnostics.get(filename) ?? []
	}

	getDiagnostics() {
		return this.#diagnostics
	}

	ok(filename?: string) {
		if (!filename) {
			return this.#diagnostics.size === 0
		}

		return this.#diagnostics.has(filename)
	}
}
