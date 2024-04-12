#!/usr/bin/env node

import { s21lintCommand } from "@/cli"
import { binary, run } from "cmd-ts"

run(binary(s21lintCommand), process.argv)
