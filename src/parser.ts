import Parser from "web-tree-sitter"
import c from "@languages/tree-sitter-c.wasm"
import cpp from "@languages/tree-sitter-cpp.wasm"

await Parser.init()

const languages = {
	c: await Parser.Language.load(c),
	cpp: await Parser.Language.load(cpp),
}

export type Language = keyof typeof languages

export function createParser(language: Language) {
	const parser = new Parser()

	parser.setLanguage(languages[language])

	return parser
}
