const utilsFunc = {
	deleteCookie: function (name) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	},

	getCookie: function (name) {
		let cookies = document.cookie.split('; ')
		for (let cookie of cookies) {
			let [key, value] = cookie.split('=')
			if (key === name) return value
		}
		return null
	},
	setDataToTable: function (table, deals, contacts) {
		const excludedKeys = [
			'id',
			'name',
			'price',
			'contact',
			'custom_fields_values',
		]

		table.insertAdjacentHTML(
			'beforeend',
			`${deals
				.map(
					item =>
						`<tr data-id="${item.id}" class="table-content">
				 ${excludedKeys
						.map(key => {
							let content = ''
							const find =
								contacts.find(
									contact => contact.created_at === item.created_at
								) || ''
							if (key === 'contact') {
								content = find.name ? find.name : ''
							} else if (key === 'custom_fields_values') {
								content = find[key] ? find[key][0]?.values[0]?.value : ''
							} else {
								content = item[key]
							}
							return `<td class=''>${content}</td>`
						}) // Создаём ячейки
						.join('')}
				</tr>`
				)
				.join('')}`
		)
	},
	delay: function (ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	},
	// Функция для создания индикатора загрузки
	createLoadingIndicator: function () {
		const loader = document.createElement('div')
		loader.className = 'spinner-grow'
		loader.setAttribute('role', 'status')
		const srText = document.createElement('span')
		srText.className = 'visually-hidden'
		srText.innerText = 'Loading...'
		loader.appendChild(srText)
		return loader
	},

	// Функция для создания SVG круга статуса
	createStatusCircle: function (color) {
		const svgNS = 'http://www.w3.org/2000/svg'
		const svg = document.createElementNS(svgNS, 'svg')
		svg.setAttribute('width', '20')
		svg.setAttribute('height', '20')
		const circle = document.createElementNS(svgNS, 'circle')
		circle.setAttribute('cx', '10')
		circle.setAttribute('cy', '10')
		circle.setAttribute('r', '8')
		circle.setAttribute('fill', color)
		svg.appendChild(circle)
		return svg
	},

	// Функция для форматирования даты в DD.MM.YYYY
	formatDate: function (timestamp) {
		const date = new Date(timestamp * 1000)
		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${day}.${month}.${year} ${hours}:${minutes}`
	},

	// Функция для определения цвета статуса задачи
	getStatusColor: function (taskDate) {
		const today = new Date()
		today.setHours(0, 0, 0, 0) // Обнуляем время

		const task = new Date(taskDate * 1000) // Если в секундах, умножаем на 1000
		task.setHours(0, 0, 0, 0) // Обнуляем время

		const timeDiff = task - today
		const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

		if (dayDiff < 0) return 'red' // Просрочена
		if (dayDiff === 0) return 'green' // Сегодня
		return 'yellow' // В будущем
	},
}

export default utilsFunc
