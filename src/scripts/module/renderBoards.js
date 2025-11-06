import topicsData from '../../data/topics.json'

export function renderBoards() {
	const boards = document.querySelector('.setting__list')

	boards.innerHTML = topicsData.boards
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
