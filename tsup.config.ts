import { type Options, defineConfig } from "tsup"

const baseConfig = {
	clean: true,
	bundle: true,
	outDir: "build",
	loader: {
		".wasm": "file",
	},
} satisfies Options

export default defineConfig([
	{
		...baseConfig,
		entry: ["src/main.ts"],
		format: "esm",
		target: "node20",
	},
	{
		...baseConfig,
		entry: ["src/index.ts"],
		format: ["esm", "cjs"],
		dts: true,
	},
])
