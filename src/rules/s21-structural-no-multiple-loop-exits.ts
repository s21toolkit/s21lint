import { defineRule } from "@/rule"
import { traverse } from "@/traversal"
import type { SyntaxNode } from "web-tree-sitter"

export const s21StructuralNoMultipleLoopExits = defineRule({
	name: "s21-structural-no-multiple-loop-exits",

	// TODO: Treat condition + exit statement as 2 exit statements (e.g. while (condition) { break; })
	check(ctx) {
		const exitStatements: SyntaxNode[][] = []

		function pushExitStatement(node: SyntaxNode) {
			const top = exitStatements.at(-1)

			if (!top) {
				return
			}

			top.push(node)
		}

		function popExitStatements() {
			const top = exitStatements.pop() ?? []

			if (top.length <= 1) {
				return
			}

			for (const node of top) {
				ctx.error(node, "multiple loop exit statements are forbidden")
			}
		}

		traverse(ctx.tree, {
			for_statement: {
				enter() {
					exitStatements.push([])
				},
				leave() {
					popExitStatements()
				},
			},
			while_statement: {
				enter() {
					exitStatements.push([])
				},
				leave() {
					popExitStatements()
				},
			},
			do_statement: {
				enter() {
					exitStatements.push([])
				},
				leave() {
					popExitStatements()
				},
			},
			// Ignore breaks out of switch statements
			switch_statement: {
				enter() {
					exitStatements.push([])
				},
				leave() {
					exitStatements.pop()
				},
			},
			// Ignore returns from lambdas
			lambda_expression: {
				enter() {
					exitStatements.push([])
				},
				leave() {
					exitStatements.pop()
				}
			},
			break_statement(node) {
				pushExitStatement(node)
			},
			return_statement(node) {
				pushExitStatement(node)
			},
		})
	},
})
