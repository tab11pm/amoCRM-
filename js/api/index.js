const api = {
	refreshAccessToken: async function (
		refreshToken,
		postData,
		postURL,
		utilsFunc
	) {
		const data = {
			...postData,
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		}

		try {
			const response = await fetch(postURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				utilsFunc.deleteCookie('token')
				utilsFunc.deleteCookie('refresh_token')
				throw new Error(`Ошибка обновления токена: ${response.statusText}`)
			}

			const tokens = await response.json()
			// Сохраните новые access_token и refresh_token для дальнейшего использования
			console.log('Новый access_token:', tokens.access_token)
			document.cookie = `token=${tokens.access_token}`
			document.cookie = `refresh_token=${tokens.refresh_token}`
		} catch (error) {
			console.error('Ошибка при обновлении access_token:', error)
		}
	},

	getAccessToken: async function (postData, postURL) {
		const data = {
			...postData,
			code: authorizationCode,
			grant_type: 'authorization_code',
		}

		try {
			const response = await fetch(postURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				utilsFunc.deleteCookie('token')
				throw new Error(`Ошибка авторизации: ${response.statusText}`)
			}

			const tokens = await response.json()
			document.cookie = `token=${tokens.access_token}`
			document.cookie = `refresh_token=${tokens.refresh_token}`
		} catch (error) {
			console.error('Ошибка при получении access_token:', error)
		}
	},

	getDeals: async function (accessToken, corsURL, page = 1, limit = 50) {
		const url = `${corsURL}/api/v4/leads?page=${page}&limit=${limit}`

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				utilsFunc.deleteCookie('token')
				throw new Error(`Ошибка получения сделок: ${response.statusText}`)
			}

			const deals = await response.json()

			return deals._embedded.leads
		} catch (error) {
			console.error('Ошибка при получении списка сделок:', error)
		}
	},
	getDealID: async function (accessToken, corsURL, id) {
		const url = `${corsURL}/api/v4/leads/${id}`
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				utilsFunc.deleteCookie('token')
				throw new Error(`Ошибка получения сделок: ${response.statusText}`)
			}

			const deals = response

			return deals
		} catch (error) {
			console.error('Ошибка при получении списка сделок:', error)
		}
	},
	getContacts: async function (accessToken, corsURL, page, limit) {
		const url = `${corsURL}/api/v4/contacts?page=${page}&limit=${limit}`

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				utilsFunc.deleteCookie('token')
				throw new Error(`Ошибка получения сделок: ${response.statusText}`)
			}

			const deals = await response.json()

			return deals._embedded.contacts
		} catch (error) {
			console.error('Ошибка при получении списка сделок:', error)
		}
	},
	getContactID: async function (accessToken, corsURL) {
		const url = `${corsURL}/api/v4/contacts/30889965`

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				utilsFunc.deleteCookie('token')
				throw new Error(`Ошибка получения сделок: ${response.statusText}`)
			}

			const deals = await response.json()

			return deals._embedded.leads
		} catch (error) {
			console.error('Ошибка при получении списка сделок:', error)
		}
	},
}

export default api
