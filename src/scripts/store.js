// listeners: коллекция функций-подписчиков (callbacks), которые нужно вызывать при каждом обновлении состояния. Set выбран, чтобы:

// исключить дубликаты одной и той же функции;

// быстро добавлять/удалять подписчиков;

// держать любое количество подписчиков, а не “последний объект”.
const listeners = new Set()

// здесь будет выбранный item
let state = {}

export const store = {
	// Получить актуальное состояние
	getState() {
		return state
	},

	// Обновить часть состояния и уведомить подписчиков
	setState(partial) {
		state = { ...state, ...partial }
		listeners.forEach(cb => cb(state))
	},

	// Подписаться на изменения
	subscribe(cb) {
		listeners.add(cb)
		// Вернуть функцию для отписки
		return () => listeners.delete(cb)
	},
}
