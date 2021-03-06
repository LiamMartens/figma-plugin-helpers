const nodeToObject = (node: any, withoutRelations?: boolean) => {
	const props = Object.entries(Object.getOwnPropertyDescriptors(node.__proto__))
	const blacklist = ['parent', 'children', 'removed', 'masterComponent']
	const obj: any = { id: node.id, type: node.type }
	for (const [name, prop] of props) {
		if (prop.get && blacklist.includes(name)) {
			try {
				obj[name] = prop.get.call(node)
				if (typeof obj[name] === 'symbol') obj[name] = 'Mixed'
			} catch (err) {
				obj[name] = undefined
			}
		}
	}
	if (node.parent && !withoutRelations) {
		obj.parent = { id: node.parent.id, type: node.parent.type }
	}
	if (node.children && !withoutRelations) {
		obj.children = node.children.map((child: any) => nodeToObject(child, withoutRelations))
	}
	if (node.masterComponent && !withoutRelations) {
		obj.masterComponent = nodeToObject(node.masterComponent, withoutRelations)
	}
	return obj
}

export default nodeToObject
