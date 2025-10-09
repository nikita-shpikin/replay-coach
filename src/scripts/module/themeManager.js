// применять тему к документу и переключать её

import { applyTheme, saveTheme } from './settingsStore'

export function initSwitcherTheme(tag) {
	tag.addEventListener('click', () => {
		const theme = document.documentElement.getAttribute('data-theme')

		const newTheme = theme === 'dark' ? 'light' : 'dark'

		applyTheme(newTheme)

		saveTheme(newTheme)
	})
}
