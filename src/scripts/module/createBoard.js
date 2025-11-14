export async function createBoard(title, token) {
	// получаем gist
	const res = await fetch(
		`https://api.github.com/gists/aea1123cacc02e47ca75e3655118f624`,
		{
			headers: { Authorization: `token ${token}` },
		}
	)
	const gist = await res.json()
	const content = JSON.parse(gist.files['topics.json'].content)

	// генератор id
	const newId =
		content.boards.reduce((max, b) => (b.id > max ? b.id : max), 0) + 1

	console.log(gist, content, newId)

	// создаём новую доску
	const newBoard = { id: newId, title, topics: [] }
	content.boards.push(newBoard)

	// обновляем gist
	await fetch(`https://api.github.com/gists/aea1123cacc02e47ca75e3655118f624`, {
		method: 'PATCH',
		headers: {
			Authorization: `token ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			files: {
				'topics.json': {
					content: JSON.stringify(content, null, 2),
				},
			},
		}),
	})

	return newBoard
}
