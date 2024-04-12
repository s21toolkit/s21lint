import type Parser from "web-tree-sitter"

export type FilterContext = {
	node: Parser.SyntaxNode
	tree: Parser.Tree
	language: Parser.Language
}

export type CheckContext = FilterContext & {
	warn: (node: Parser.SyntaxNode, message: string) => void
	error: (node: Parser.SyntaxNode, message: string) => void
}

export type Rule = {
	name: string

	filter?: (context: FilterContext) => boolean

	check: (context: CheckContext) => void
}

export function defineRule(rule: Rule): Rule {
	return rule
}
