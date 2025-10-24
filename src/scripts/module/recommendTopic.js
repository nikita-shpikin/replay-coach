import { store } from '../store'

export function getRecommendedTopic(json) {
	const btnNewTheme = document.querySelector(`[data-js='new-theme']`)
	const subTitle = document.querySelector('.setting__subtitle')
	const subtopics = json.boards.flatMap(board =>
		board.topics.flatMap(topic => topic.subtopics)
	)

	const uniqueTheme = new Set([])

	btnNewTheme.addEventListener('click', async () => {
		await waitTopic()

		showTopic()
	})

	//Перебор массива
	async function waitTopic() {
		for (let index = 0; index < subtopics.length; index++) {
			await new Promise(resolve => setTimeout(resolve, 50))

			subTitle.textContent = subtopics[index].title
		}
	}

	// Выбор и вывод темы
	function showTopic() {
		const item = getRandomTheme(subtopics)

		subTitle.textContent = item.title

		store.setState(item)
	}

	// Случайная тема с учётом пройденного
	function getRandomTheme(arr) {
		// Массив всех завершённых без повторений отфильтрованный от меньшего к большему
		const completedTimes = [...new Set(arr.map(item => item.completed))].sort(
			(a, b) => a - b
		)

		// цикл раз в массиве завершённых
		for (let time of completedTimes) {
			// Фильтрация от меньшего к большему по разам
			const filterArr = arr.filter(item => item.completed === time)
			// Фильтрация если тема есть в уникальном то без неё
			const unusedThemes = filterArr.filter(item => !uniqueTheme.has(item))

			// если в массиве есть то рандомное число неиспользованных тем и добавляем в уникальные с возвращением
			if (unusedThemes.length > 0) {
				const randomTheme =
					unusedThemes[Math.floor(Math.random() * unusedThemes.length)]
				uniqueTheme.add(randomTheme)
				return randomTheme
			}
		}

		// Если все темы использованы — обнуляем уникальные и начинаем рекурсию
		uniqueTheme.clear()

		return getRandomTheme(arr)
	}

	showTopic()
}
