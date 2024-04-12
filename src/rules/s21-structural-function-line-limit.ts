import { defineRule } from "@/lib"

const FUNCTION_BODY_LINE_LIMIT = 50

export const s21StructuralFunctionLineLimit = defineRule({
	name: "s21-structural-function-line-limit",

	check(ctx) {
		const functionBodies = ctx.language
			.query("(function_definition body: _ @body)")
			.captures(ctx.node)

		for (const functionBody of functionBodies) {
			const { startPosition, endPosition } = functionBody.node

			const lineCount = endPosition.row - startPosition.row
			if (lineCount > FUNCTION_BODY_LINE_LIMIT) {
				ctx.error(
					functionBody.node,
					`function body must not exceed ${FUNCTION_BODY_LINE_LIMIT} lines`,
				)
			}
		}
	},
})
