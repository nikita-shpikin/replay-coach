import boards from '../data/topics.json'
import { loadPomodoroSettings, pomodoro } from './module/pomodoro.js'
import { getRecommendedTopic } from './module/recommendTopic'
import { renderBoards } from './module/renderBoards.js'
import { fetchBoards } from './module/serviceBoards.js'
import { loadTheme } from './module/settingsStore'
import { startPomodoroSession } from './module/startPomodoroSession.js'
import { initSwitcherTheme } from './module/themeManager'

const switcherTag = document.querySelector('.setting__switcher')

document.addEventListener('DOMContentLoaded', () => {
	fetchBoards()
	loadTheme()
	initSwitcherTheme(switcherTag)
	getRecommendedTopic(boards)
	pomodoro()
	loadPomodoroSettings()
	startPomodoroSession()
	renderBoards()
})
