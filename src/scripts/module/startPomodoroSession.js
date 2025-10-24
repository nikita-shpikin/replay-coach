import { EXERCISES } from '../../data/exercises'
import { store } from '../store'

// Клик на кнопку
export function startPomodoroSession() {
	const startTheme = document.querySelector('[data-js="start-theme"]')
	const pomodoroBlock = document.querySelector('.pomodoro')
	const setting = document.querySelector('.setting ')

	startTheme?.addEventListener('click', () => {
		let countStart = Number(sessionStorage.getItem('sessionCount')) || 0
		countStart++
		sessionStorage.setItem('sessionCount', countStart)

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

			setTimeout(() => {
				startBreakTimer()
			}, 500)

			return
		}

		const min = Math.floor(remainingTime / 60000)
		const sec = Math.floor((remainingTime % 60000) / 1000)

		pomodoroTitle.textContent = `${String(min).padStart(2, '0')}:${String(
			sec
		).padStart(2, '0')}`
	}, 100)

	// Вывод подайтемов в блоке помодоро
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
						console.log(
							`%cТЕМА:%c ${store.getState().title}\n%cПОДТЕМЫ:%c ${
								li.textContent
							}`,
							'color: #4CAF50; font-weight: bold;',
							'color: inherit;',
							'color: #2196F3; font-weight: bold;',
							'color: inherit;'
						)

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

function startBreakTimer() {
	const pomodoroTitle = document.querySelector('.pomodoro__title')
	const setting = document.querySelector('.setting ')
	const pomodoroBlock = document.querySelector('.pomodoro')
	const longBreak = parseInt(localStorage.getItem('long-duration'), 10)
	const shortBreak = parseInt(localStorage.getItem('short-duration'), 10)

	const durationLongBreak = longBreak * 60 * 1000
	const durationShortBreak = shortBreak * 60 * 1000

	const endLongBreak = Date.now() + durationLongBreak
	const endShortBreak = Date.now() + durationShortBreak

	resetPomodoroContent()

	const intervalBreakId = setInterval(() => {
		const remainingLongBreak = endLongBreak - Date.now()
		const remainingShortBreak = endShortBreak - Date.now()

		let countStart = Number(sessionStorage.getItem('sessionCount')) || 0
		let remainingBreak

		if (countStart % 3 === 0) {
			remainingBreak = remainingLongBreak
		} else {
			remainingBreak = remainingShortBreak
		}

		// Обнуление
		if (remainingBreak <= 0) {
			clearInterval(intervalBreakId)

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

		const min = Math.floor(remainingBreak / 60000)
		const sec = Math.floor((remainingBreak % 60000) / 1000)

		pomodoroTitle.textContent = `${String(min).padStart(2, '0')}:${String(
			sec
		).padStart(2, '0')}`
	}, 100)

	renderImageSlider()
}

function renderImageSlider() {
	resetPomodoroContent()

	const pomodoroContent = document.querySelector('.pomodoro__content')
	const randomKey = getRandomKey(EXERCISES)
	const exercises = EXERCISES[randomKey]
	pomodoroContent.classList.add('pomodoro__content-exercises')

	exercises.forEach(ex => {
		const li = document.createElement('li')
		li.classList.add('pomodoro__content-item')

		const img = document.createElement('img')
		img.classList.add('pomodoro__content-img')

		img.alt = ex.title
		img.title = ex.title
		img.width = 100
		img.height = 100

		img.src = `./src/assets/exercises/${ex.src}`

		li.appendChild(img)
		pomodoroContent.appendChild(li)
	})

	let indexExercises = 0

	function showSlide(i) {
		const items = document.querySelectorAll('.pomodoro__content-item')

		indexExercises = (i + items.length) % items.length

		pomodoroContent.style.transform = `translateX(-${indexExercises * 80}%)`
	}

	document.addEventListener('keydown', e => {
		if (e.key === 'ArrowRight') showSlide(indexExercises + 1)
		if (e.key === 'ArrowLeft') showSlide(indexExercises - 1)
	})

	let startX = 0
	let isDown = false

	function onStart(e) {
		isDown = true
		startX = e.pageX || e.touches[0].pageX
	}

	function onMove(e) {
		if (!isDown) return
		const x = e.pageX || e.touches[0].pageX
		const diff = x - startX

		// если сдвиг больше 50px — листаем
		if (diff > 50) {
			showSlide(indexExercises - 1)
			isDown = false
		} else if (diff < -50) {
			showSlide(indexExercises + 1)
			isDown = false
		}
	}

	function onEnd() {
		isDown = false
	}

	pomodoroContent.addEventListener('mousedown', onStart)
	pomodoroContent.addEventListener('mousemove', onMove)
	pomodoroContent.addEventListener('mouseup', onEnd)
	pomodoroContent.addEventListener('mouseleave', onEnd)

	pomodoroContent.addEventListener('touchstart', onStart, { passive: true })
	pomodoroContent.addEventListener('touchmove', onMove, { passive: true })
	pomodoroContent.addEventListener('touchend', onEnd)
}

// Случайнный ключ объекта
function getRandomKey(obj) {
	const keys = Object.keys(obj)

	const randomKey = Math.floor(Math.random() * keys.length)

	return keys[randomKey]
}

// Очищение блока контента помодоро
function resetPomodoroContent() {
	const pomodoroContent = document.querySelector('.pomodoro__content')
	pomodoroContent.innerHTML = ''
}

// 💡 Как это работает в цикле
// Каждую секунду ты:

// Сравниваешь endTime с Date.now()

// Получаешь remaining

// Выводишь minutes и seconds в UI

// Если remaining <= 0 — таймер завершён
