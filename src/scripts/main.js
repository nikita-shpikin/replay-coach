import { loadTheme } from './module/settingsStore'
import { initSwitcherTheme } from './module/themeManager'

const switcherTag = document.querySelector('.setting__switcher')

document.addEventListener('DOMContentLoaded', () => {
	loadTheme()
	initSwitcherTheme(switcherTag)
})
