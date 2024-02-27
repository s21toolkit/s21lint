import type Parser from "web-tree-sitter"
import type { Rule } from "./rule"

export namespace Diagnostic {
	export type Severity = "warn" | "error"
}

export type Diagnostic = {
	reporter: Rule

	severity: Diagnostic.Severity

	node: Parser.SyntaxNode

	message: string
}
