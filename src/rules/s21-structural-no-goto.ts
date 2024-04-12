import { defineRule } from "@/lib"

export const s21StructuralNoGoto = defineRule({
	name: "s21-structural-no-goto",

	check(ctx) {
		const gotoStatements = ctx.language
			.query("(goto_statement) @goto")
			.captures(ctx.node)

		for (const gotoStatement of gotoStatements) {
			ctx.error(gotoStatement.node, "goto statement is forbidden")
		}
	},
})
