import c from "@languages/tree-sitter-c.wasm"
import cpp from "@languages/tree-sitter-cpp.wasm"
import Parser from "web-tree-sitter"
import { join } from "node:path"

await Parser.init()

const languages = {
	c: await Parser.Language.load(join(import.meta.dirname, c)),
	cpp: await Parser.Language.load(join(import.meta.dirname, cpp)),
}

export type Language = keyof typeof languages

export function createParser(language: Language) {
	const parser = new Parser()

	parser.setLanguage(languages[language])

	return parser
}
