import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts", "src/main.ts"],
	clean: true,
	bundle: true,
	dts: true,
	outDir: "build",
	format: "esm",
	target: "node20",
	loader: {
		".wasm": "file",
	},
})
