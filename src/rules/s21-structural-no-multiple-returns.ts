import { defineRule, traverse } from "@/lib"
import type { SyntaxNode } from "web-tree-sitter"

export const s21StructuralNoMultipleReturns = defineRule({
	name: "s21-structural-no-multiple-returns",

	check(ctx) {
		const returnStatements: SyntaxNode[][] = []

		const functionVisitor = {
			enter() {
				returnStatements.push([])
			},
			leave() {
				const top = returnStatements.pop()

				if (!top || top.length <= 1) {
					return
				}

				// Emit warnings since we can't be sure that all return statements are used correctly
				for (const node of top) {
					ctx.warn(
						node,
						"multiple return statements are only allowed for argument validation",
					)
				}
			},
		}

		traverse(ctx.tree, {
			function_definition: functionVisitor,
			lambda_expression: functionVisitor,
			return_statement(node) {
				const top = returnStatements.at(-1)

				if (!top) {
					return
				}

				top.push(node)
			},
		})
	},
})
