# amoCRM - Внешняя интеграция
Для начала нужно установить прокси для обхода CORS. Я использовал [CORS Anywhere](https://github.com/Rob--W/cors-anywhere) полсе установки можно просто открыт index.html либо если в VS Code есть  **Live Server** можно запустить через него.

Ключи хранятся в **consts/index.js** нужно создать данный файл и добавить туда следующее значение

```js
const amocrm = {
	clientId: 'client_id',
	clientSecret: 'client_secret',
	redirectUri: 'redirect_uri',
	subdomain: 'subdomain',
	authorizationCode: 'authorization_code',
}

export default amocrm
```

