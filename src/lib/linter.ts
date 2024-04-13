import type Parser from "web-tree-sitter"
import type { Diagnostic } from "./diagnostic"
import type { Rule } from "./rule"

export class Linter {
	readonly #errors = new Map<string, Diagnostic[]>()
	readonly #warnings = new Map<string, Diagnostic[]>()

	constructor(
		readonly configuration: {
			rules: Rule[]
		},
	) {}

	emitDiagnostic(filename: string, diagnostic: Diagnostic) {
		const collection =
			diagnostic.severity === "error" ? this.#errors : this.#warnings

		if (!collection.has(filename)) {
			collection.set(filename, [diagnostic])
		} else {
			// biome-ignore lint/style/noNonNullAssertion:
			collection.get(filename)!.push(diagnostic)
		}
	}

	checkProgram(program: Parser.Tree, filename = "default") {
		this.clearFileDiagnostics(filename)

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
		const warnings = this.diagnostics.warnings.get(filename) ?? []
		const errors = this.diagnostics.errors.get(filename) ?? []

		return {
			warnings,
			errors,
			*[Symbol.iterator]() {
				yield* this.warnings
				yield* this.errors
			},
		}
	}

	get diagnostics() {
		return {
			warnings: this.#warnings,
			errors: this.#errors,
			*[Symbol.iterator]() {
				yield* this.warnings
				yield* this.errors
			},
		}
	}

	hasErrors(filename?: string) {
		if (!filename) {
			return this.diagnostics.errors.size > 0
		}

		return this.diagnostics.errors.has(filename)
	}

	hasWarnings(filename?: string) {
		if (!filename) {
			return this.diagnostics.warnings.size > 0
		}

		return this.diagnostics.warnings.has(filename)
	}

	hasDiagnostics(filename?: string) {
		return this.hasErrors(filename) || this.hasWarnings(filename)
	}

	getStats(filename?: string) {
		const errors = []
		const warnings = []

		if (!filename) {
			for (const diagnostic of this.diagnostics.errors.values()) {
				errors.push(...diagnostic)
			}

			for (const diagnostic of this.diagnostics.warnings.values()) {
				warnings.push(...diagnostic)
			}
		} else {
			const errorDiagnostics = this.diagnostics.errors.get(filename) ?? []
			const warningDiagnostics =
				this.diagnostics.warnings.get(filename) ?? []

			errors.push(...errorDiagnostics)
			warnings.push(...warningDiagnostics)
		}

		return {
			errors: errors.length,
			warnings: warnings.length,
			total: errors.length + warnings.length,
		}
	}

	clearDiagnostics() {
		this.#errors.clear()
		this.#warnings.clear()
	}

	clearFileDiagnostics(filename: string) {
		this.#errors.delete(filename)
		this.#warnings.delete(filename)
	}
}
