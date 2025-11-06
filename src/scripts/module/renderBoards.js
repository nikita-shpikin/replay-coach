export async function renderBoards() {
	const boardsContainer = document.querySelector('.setting__list')

	const response = await fetch(
		'https://gist.githubusercontent.com/nikita-shpikin/aea1123cacc02e47ca75e3655118f624/raw/topics.json'
	)
	const topicsData = await response.json()

	console.log(response, topicsData)

	// Генерируем HTML для досок
	let boardsHTML = ''
	if (topicsData.boards && topicsData.boards.length > 0) {
		boardsHTML = topicsData.boards
			.map(board => {
				return `
          <div class="setting__list-item">
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

	// Добавляем кнопку "Добавить доску" в любом случае
	const addBoardHTML = `
    <div class="setting__list-item">
      <button class="add-board-btn">+ Добавить доску</button>
    </div>
  `

	boardsContainer.innerHTML = boardsHTML + addBoardHTML
}
