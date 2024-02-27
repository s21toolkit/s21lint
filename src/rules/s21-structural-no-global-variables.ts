import { defineRule } from "@/rule"
import { oneLine } from "common-tags"

const GLOBAL_VARIABLE_DECLARATION_QUERY = oneLine`
	(translation_unit
		(declaration
			(type_qualifier)? @type_qualifier
			declarator: [(init_declarator) (identifier)]
		) @declaration
		(#not-eq? @type_qualifier "const")
	)
`

export const s21StructuralNoGlobalVariables = defineRule({
	name: "s21-structural-no-global-variables",

	check(ctx) {
		const globalVariableDeclarations = ctx.language
			.query(GLOBAL_VARIABLE_DECLARATION_QUERY)
			.captures(ctx.node)

		for (const globalVariableDeclaration of globalVariableDeclarations) {
			ctx.error(
				globalVariableDeclaration.node,
				"global variables are forbidden",
			)
		}
	},
})
