export function pomodoro() {
	const settingBtn = document.querySelector('.setting__btn-icon')
	const settingBlock = document.querySelector('.setting__block')
	const pomodoroBlock = document.querySelector('.pomodoro')
	const settingRanges = document.querySelectorAll('.setting__timer-range')

	settingBtn.addEventListener('click', () => {
		settingBlock.classList.toggle('setting__block--active')
		pomodoroBlock.classList.remove('pomodoro--active')
	})

	settingRanges.forEach(item => {
		item.addEventListener('input', () => {
			updateSliderVisual(item)

			if (item.id) localStorage.setItem(item.id, item.value)
		})
	})
}

export function loadPomodoroSettings() {
	const settingRanges = document.querySelectorAll('.setting__timer-range')

	settingRanges.forEach(item => {
		const savedValue = localStorage.getItem(item.id)

		if (savedValue !== null) {
			const numericValue = Number(savedValue)
			item.value = numericValue

			const val = ((numericValue - item.min) / (item.max - item.min)) * 100
			item.style.backgroundSize = `${val}% 100%`

			const parentRange = item.closest('.setting__timer-block')
			const time = parentRange?.querySelector('.setting__timer-value')
			if (time) time.textContent = numericValue
		}
	})
}

function updateSliderVisual(item) {
	const val = ((item.value - item.min) / (item.max - item.min)) * 100
	item.style.backgroundSize = `${val}% 100%`

	const parent = item.closest('.setting__timer-block')
	const time = parent?.querySelector('.setting__timer-value')
	if (time) time.textContent = item.value
}
