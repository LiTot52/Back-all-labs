const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.get('/', (req, res) => {
	res.send('Добро пожаловать на базовый сервер!');
});

app.get('/api/status', (req, res) => {
	res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/info', (req, res) => {
	res.json({ author: 'Student', version: '1.0.0' });
});

app.get('/api/users/:id', (req, res) => {
	res.json({
		message: 'Информация о пользователе',
		userId: req.params.id
	});
});

app.use((req, res) => {
	res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});
