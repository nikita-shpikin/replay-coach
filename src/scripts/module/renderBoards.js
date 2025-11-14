import { createBoard } from './createBoard.js'
import { deleteBoard } from './deleteBoard.js'
import { getBoards } from './serviceBoards.js'

export async function renderBoards() {
	const boardsContainer = document.querySelector('.setting__list')

	await drawBoards(boardsContainer)

	const addBoardBtn = boardsContainer.querySelector('.setting__list-btn')
	const listBoard = document.querySelector('.setting__list')

	addBoardBtn.addEventListener('click', async () => {
		const titleBoard = prompt('Название доски?')
		const token = prompt('Напишите ваш GitHub токен:')

		try {
			await createBoard(titleBoard, token)

			await drawBoards(boardsContainer)
		} catch (err) {
			alert('Токен не подходит или ошибка при обновлении gist')
			console.error(err)
		}
	})

	listBoard.addEventListener('click', async e => {
		const btnDelete = e.target.closest('.setting__list-delete')

		console.log(getBoards())

		if (!btnDelete) return

		const idBtn = btnDelete.dataset.id

		if (!idBtn) return

		if (btnDelete.disabled) return

		await deleteBoard(btnDelete, idBtn)
	})
}

async function drawBoards(container) {
	const response = await fetch(
		'https://gist.githubusercontent.com/nikita-shpikin/aea1123cacc02e47ca75e3655118f624/raw/topics.json?nocache=' +
			Date.now()
	)
	const topicsData = await response.json()

	let boardsHTML = ''
	if (topicsData.boards?.length > 0) {
		boardsHTML = topicsData.boards
			.map(board => {
				return `
          <div class="setting__list-item" data-id="${board.id}">
						<button data-id="${board.id}" class='setting__list-delete'>&#x2717;</button>
            <h2 class="setting__list-title">${board.title}</h2>
            <ul class="setting__topic">
              ${board.topics
								.map(topic => {
									return `
                    <li class="setting__topic-item">
                      <details>
                        <summary class="setting__list-subtitle">${
													topic.title
												}</summary>
                        <ul class="setting__subtopic">
                          ${topic.subtopics
														.map(sub => {
															return `
                                <li class="setting__subtopic-item">
                                  <details>
                                    <summary class="setting__subtopic-title">${
																			sub.title
																		}</summary>
                                    <ul class="setting__items">
                                      ${sub.items
																				.map(
																					item =>
																						`<li class="setting__items-item">${item}</li>`
																				)
																				.join('')}
                                    </ul>
                                  </details>
                                </li>
                              `
														})
														.join('')}
                        </ul>
                      </details>
                    </li>
                  `
								})
								.join('')}
            </ul>
          </div>
        `
			})
			.join('')
	}

	const addBoardHTML = `
    <div class="setting__list-item setting__list-add">
      <button class="setting__list-btn">+ Добавить доску</button>
    </div>
  `

	container.innerHTML = boardsHTML + addBoardHTML
}
