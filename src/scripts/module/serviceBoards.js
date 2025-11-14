let boards = []

const GIST_URL = 'https://api.github.com/gists/aea1123cacc02e47ca75e3655118f624'
const FILE_NAME = 'topics.json'

export async function fetchBoards() {
	const res = await fetch(GIST_URL)

	if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`)

	const gist = await res.json()

	const content = gist.files[FILE_NAME].content
	boards = JSON.parse(content).boards || []

	return boards
}

export function getBoards() {
	return boards
}

export async function updateBoards(nextBoards) {
	const TOKEN = prompt('Напишите ваш GitHub токен:')

	boards = nextBoards

	await fetch(`GIST_URL`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			files: {
				[FILE_NAME]: { content: JSON.stringify({ boards }, null, 2) },
			},
		}),
	})
}
