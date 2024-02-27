import type { Rule } from "@/rule"
import { s21StructuralNoGoto } from "./s21-structural-no-goto"
import { s21StructuralFunctionLineLimit } from "./s21-structural-function-line-limit"

export const rules = [
	s21StructuralNoGoto,
	s21StructuralFunctionLineLimit,
] satisfies Rule[]
