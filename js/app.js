import api from './api/index.js'
import amocrm from './consts/index.js'
import utilsFunc from './utils/index.js'

const table = document.querySelector('#transactionTable  tbody')
const loader = document.querySelector('.loader')

const postData = {
	client_id: amocrm.clientId,
	client_secret: amocrm.clientSecret,
	redirect_uri: amocrm.redirectUri,
}

const corsURL = `http://localhost:8080/https://${amocrm.subdomain}.amocrm.ru`
const postURL = `${corsURL}/oauth2/access_token`
async function main() {
	let page = 1
	const limit = 50
	let deals = []
	let contacts = []

	const accessToken = utilsFunc.getCookie('access_token')
	const refreshToken = utilsFunc.getCookie('refresh_token')
	if (!accessToken && refreshToken) {
		await api.refreshAccessToken(
			refreshToken,
			postData,
			postURL,
			utilsFunc.deleteCookie
		)
	}
	if (!accessToken && !refreshToken) {
		api.getAccessToken(postData, postURL, amocrm.authorizationCode, utilsFunc)
	}
	if (utilsFunc.getCookie('access_token')) {
		do {
			const fetchingContacts = await api.getContacts(
				utilsFunc.getCookie('access_token'),
				corsURL,
				page,
				limit
			)
			const fetchedDeals = await api.getDeals(accessToken, corsURL, page, limit)
			if (
				fetchedDeals &&
				fetchedDeals.length > 0 &&
				fetchingContacts &&
				fetchingContacts.length > 0
			) {
				loader.classList.remove('hidden')
				deals = deals.concat(fetchedDeals)
				contacts = contacts.concat(fetchingContacts)
				page++
				// Делаем паузу в 1 секунду между запросами страниц
				await utilsFunc.delay(1000)
			} else {
				loader.classList.add('hidden')
				break
			}
		} while (true)

		console.log('Список сделок:', deals)
		console.log('Список контактов:', contacts)
		utilsFunc.setDataToTable(table, deals, contacts)
	}
}

main()

document.addEventListener('DOMContentLoaded', () => {
	const tableBody = document.querySelector('tbody') // Родительский элемент
	let openRow = null // Переменная для хранения открытой строки

	// Делегирование событий: обработчик кликов назначается на родительский элемент таблицы
	tableBody.addEventListener('click', async event => {
		const row = event.target.closest('.table-content')

		if (!row) return // Если клик был не по строке сделки, выходим

		// Закрытие ранее открытой строки
		if (openRow && openRow !== row) {
			openRow.innerHTML = openRow.dataset.originalContent
		}

		// Сохранение текущей строки как открытой
		openRow = row

		// Сохранение оригинального содержимого строки
		if (!row.dataset.originalContent) {
			row.dataset.originalContent = row.innerHTML
		}

		// Отображение индикатора загрузки
		row.innerHTML = ''
		const loaderCell = document.createElement('td')
		loaderCell.colSpan = 5 // Предполагаем, что в строке 5 столбцов
		loaderCell.appendChild(utilsFunc.createLoadingIndicator())
		row.appendChild(loaderCell)

		// Получение ID сделки
		const dealId = row.dataset.id

		try {
			// Запрос к API для получения подробностей сделки
			const response = await api.getDealID(
				utilsFunc.getCookie('access_token'),
				corsURL,
				dealId
			)
			const deal = await response.json()

			// Очистка строки и вставка подробных данных
			row.innerHTML = `
				<td>${deal.id}</td>
        <td>${utilsFunc.formatDate(deal.created_at)}</td>
        <td></td>
        <td></td>
        <td></td>
		 `

			// Определение цвета статуса ближайшей задачи
			const statusColor = utilsFunc.getStatusColor(deal.closest_task_at)
			const statusCell = row.querySelector('td:last-child')
			statusCell.appendChild(utilsFunc.createStatusCircle(statusColor))
		} catch (error) {
			console.error('Ошибка при получении данных сделки:', error)
			// Восстановление оригинального содержимого в случае ошибки
			row.innerHTML = row.dataset.originalContent
		}
	})
})
