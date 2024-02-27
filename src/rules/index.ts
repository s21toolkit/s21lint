import type { Rule } from "@/rule"
import { s21StructuralNoGoto } from "./s21-structural-no-goto"
import { s21StructuralFunctionLineLimit } from "./s21-structural-function-line-limit"
import { s21StructuralIndentationLimit } from "./s21-structural-indentation-limit"
import { s21StructuralNoGlobalVariables } from "./s21-structural-no-global-variables"

export const rules = [
	s21StructuralNoGoto,
	s21StructuralFunctionLineLimit,
	s21StructuralIndentationLimit,
	s21StructuralNoGlobalVariables,
] satisfies Rule[]
