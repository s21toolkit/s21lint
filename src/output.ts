import chalk from "chalk"
import type { Diagnostic } from "./diagnostic"
import { stripIndent } from "common-tags"

export function printDiagnostic(
	filename: string,
	source: string,
	diagnostic: Diagnostic,
) {
	const { node, message, severity, reporter } = diagnostic

	const { row, column } = node.startPosition

	const line = source.split("\n")[row]

	const lineNumberPrefix = `${row + 1}: `

	const columnPointerOffset = " ".repeat(column + lineNumberPrefix.length)

	const messageColor = severity === "error" ? chalk.red : chalk.yellow

	const severityTag = messageColor(`[${severity}]`)
	const location = chalk.blue(`${filename}:${row + 1}:${column + 1}`)

	console.log(stripIndent`
		${severityTag} ${location} (${reporter.name})
		${lineNumberPrefix}${chalk.gray(line)}
		${columnPointerOffset}${messageColor(`^--- ${message}`)}
	`)
}
