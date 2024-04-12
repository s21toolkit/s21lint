import { defineRule, traverse } from "@/lib"

const INDENTATION_LIMIT = 4

export const s21StructuralIndentationLimit = defineRule({
	name: "s21-structural-indentation-limit",

	check(ctx) {
		let currentIndentation = 0

		traverse(ctx.tree, {
			compound_statement: {
				enter(node) {
					currentIndentation++

					if (currentIndentation > INDENTATION_LIMIT) {
						ctx.error(
							node,
							`code blocks must not exceed ${INDENTATION_LIMIT} indentation levels`,
						)
					}
				},
				leave() {
					currentIndentation--
				},
			},
		})
	},
})
