// хранить и управлять настройками

export function saveTheme(theme) {
	if (theme) {
		safeStorage?.set('theme', theme)
	}
}

export function loadTheme() {
	const themeStorage = safeStorage?.get('theme')

	if (themeStorage) {
		applyTheme(themeStorage)
		return
	}

	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

	if (prefersDark) {
		applyTheme('dark')
		return
	}

	applyTheme(getHours())
}

function getHours() {
	let hour = new Date().getHours()

	return hour >= 19 || hour <= 7 ? 'dark' : 'light'
}

const safeStorage = {
	get(key) {
		try {
			const value = localStorage.getItem(key)

			return value ? JSON.parse(value) : null
		} catch (err) {
			console.error(`Ошибка ключа ${key}`, err)
		}
	},

	set(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch (err) {
			console.error(`Ошибка в ${key}`, err)
		}
	},
}

export function applyTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme)
}
