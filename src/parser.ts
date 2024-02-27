import Parser from "web-tree-sitter"

await Parser.init()

const languages = {
	c: await Parser.Language.load("tree-sitter-c.wasm"),
	// cpp: await Parser.Language.load("tree-sitter-cpp.wasm"),
}

export type Language = keyof typeof languages

export function createParser(language: Language) {
	const parser = new Parser()

	parser.setLanguage(languages[language])

	return parser
}
