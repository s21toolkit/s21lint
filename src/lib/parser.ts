import { join } from "node:path"
import c from "@languages/tree-sitter-c.wasm"
import cpp from "@languages/tree-sitter-cpp.wasm"
import Parser from "web-tree-sitter"

async function loadLanguages() {
	const languages = {
		c: await Parser.Language.load(join(import.meta.dirname, c)),
		cpp: await Parser.Language.load(join(import.meta.dirname, cpp)),
	}

	return languages
}

export type Language = keyof Awaited<ReturnType<typeof loadLanguages>>

let languages: Awaited<ReturnType<typeof loadLanguages>> | undefined

export async function createParser(language: Language) {
	await Parser.init()

	const parser = new Parser()

	if (!languages) {
		languages = await loadLanguages()
	}

	parser.setLanguage(languages[language])

	return parser
}
