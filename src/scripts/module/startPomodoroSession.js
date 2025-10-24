import { store } from '../store'

export function startPomodoroSession() {
	const startTheme = document.querySelector('[data-js="start-theme"]')
	const pomodoroBlock = document.querySelector('.pomodoro')
	const setting = document.querySelector('.setting ')

	startTheme?.addEventListener('click', () => {
		pomodoroBlock.classList.add('pomodoro--active')

		document.querySelector('.pomodoro')?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})

		setTimeout(() => {
			setting.classList.add('setting--inactive')
		}, 500)

		startPomodoroTimer()
	})
}

function startPomodoroTimer() {
	const pomodoroTitle = document.querySelector('.pomodoro__title')
	const workDuration = parseInt(localStorage.getItem('work-duration'), 10)
	const setting = document.querySelector('.setting ')
	const pomodoroBlock = document.querySelector('.pomodoro')

	// Преобразует минуты в миллисекунды
	// Почему: Всё в JavaScript работает с временем в миллисекундах. Твои "40" минут → 40 * 60 * 1000 = 2 400 000 миллисекунд.
	// Как использовать: Это длительность таймера, которую ты потом сравниваешь с текущим временем.

	// const durationTimer = workDuration * 60 * 1000
	const durationTimer = 0.05 * 60 * 1000

	// 	Что делает: Сохраняет момент окончания таймера.
	// Почему: Date.now() — это текущий момент в миллисекундах. Прибавляя durationMs, ты получаешь точку в будущем, когда таймер должен закончиться.
	// Пример: Если сейчас Date.now() = 1694950000000, а durationMs = 2400000, то endTime = 1694952400000 — это момент, когда таймер должен завершиться.
	const endTime = Date.now() + durationTimer

	const intervalId = setInterval(() => {
		// Что делает: Вычисляет, сколько времени осталось до конца таймера.
		// Почему: Ты не просто считаешь секунды — ты сравниваешь с реальным временем, чтобы таймер не сбивался, даже если setInterval лагает или вкладка была неактивна.
		// Преимущество: Таймер всегда точный, даже если браузер притормозил.
		const remainingTime = endTime - Date.now()

		// Обнуление
		if (remainingTime <= 0) {
			clearInterval(intervalId)

			setting.classList.remove('setting--inactive')

			setting?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})

			setTimeout(() => {
				pomodoroBlock.classList.remove('pomodoro--active')
			}, 500)

			return
		}

		const min = Math.floor(remainingTime / 60000)
		const sec = Math.floor((remainingTime % 60000) / 1000)

		pomodoroTitle.textContent = `${String(min).padStart(2, '0')}:${String(
			sec
		).padStart(2, '0')}`
	}, 100)

	setTimeout(() => {
		const pomodoroContent = document.querySelector('.pomodoro__content')

		if (!pomodoroContent) return

		// очищаем контейнер, если нужно каждый раз заново
		pomodoroContent.innerHTML = ''

		store.getState().items.forEach(item => {
			// Создание элемента
			const li = document.createElement('li')
			li.classList.add('pomodoro__subtitle')
			li.textContent = String(item)

			// Логика копирования
			li.addEventListener('click', () => {
				navigator.clipboard
					.writeText(li.textContent)
					.then(() => {
						// Оповещение
						console.log('Скопировано:', li.textContent)

						// Стиль при клике
						li.style.color = '#ac9b64'
						setTimeout(() => (li.style.color = ''), 300)
					})
					.catch(err => console.error('Ошибка копирования:', err))
			})

			pomodoroContent.appendChild(li)
		})
	}, 500)
}

// 💡 Как это работает в цикле
// Каждую секунду ты:

// Сравниваешь endTime с Date.now()

// Получаешь remaining

// Выводишь minutes и seconds в UI

// Если remaining <= 0 — таймер завершён
