import type { Rule } from "@/rule"
import { s21StructuralNoGoto } from "./s21-structural-no-goto"

export const rules = [s21StructuralNoGoto] satisfies Rule[]
