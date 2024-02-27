import type Parser from "web-tree-sitter"

export namespace Visitor {
	export type NodeVisitor = (
		node: Parser.SyntaxNode,
		path: Parser.SyntaxNode[],
	) => void

	export type EnterLeaveVisitor = {
		enter?: NodeVisitor
		leave?: NodeVisitor
	}
}

export type Visitor = Record<
	string,
	Visitor.NodeVisitor | Visitor.EnterLeaveVisitor
>

type TraversalRecord = {
	node: Parser.SyntaxNode
	enter: boolean
	path: Parser.SyntaxNode[]
}

function visit(record: TraversalRecord, visitor: Visitor) {
	const visitHandler = visitor[record.node.type]

	if (!visitHandler) {
		return
	}

	const node = record.node
	const path = [...record.path, record.node]

	if (typeof visitHandler === "function") {
		if (record.enter) {
			visitHandler(node, path)
		}
	} else {
		if (record.enter) {
			visitHandler.enter?.(node, path)
		} else {
			visitHandler.leave?.(node, path)
		}
	}
}

export function traverse(tree: Parser.Tree, visitor: Visitor) {
	const traversalStack: TraversalRecord[] = [
		{
			node: tree.walk().currentNode(),
			enter: true,
			path: [],
		},
	]

	while (traversalStack.length > 0) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const record = traversalStack.pop()!

		visit(record, visitor)

		if (record.enter) {
			traversalStack.push({
				node: record.node,
				enter: false,
				path: record.path,
			})

			for (const node of record.node.children) {
				traversalStack.push({
					node,
					enter: true,
					path: [...record.path, record.node],
				})
			}
		}
	}
}
