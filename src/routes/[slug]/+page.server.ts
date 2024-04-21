import Markdoc from '@markdoc/markdoc'
import yaml from 'js-yaml'
import * as fs from 'node:fs/promises'
import path from 'node:path'

async function getPost(slug: string) {
	const file = path.resolve(`posts/${slug}.md`)
	return await fs.readFile(file, 'utf-8')
}

function getFrontmatter(frontmatter: string) {
	return yaml.load(frontmatter)
}

async function markdoc(slug: string) {
	const post = await getPost(slug)
	const ast = Markdoc.parse(post)
	const content = Markdoc.transform(ast, {
		tags: {
			callout: {
				render: 'Callout',
				attributes: {
					type: {
						type: String,
						default: 'note',
					},
				},
			},
			counter: {
				render: 'Counter',
			},
		},
		variables: {
			frontmatter: getFrontmatter(ast.attributes.frontmatter),
		},
	})
	// @ts-ignore
	return JSON.stringify(content.children)
}

export async function load({ params }) {
	return { children: await markdoc(params.slug) }
}
