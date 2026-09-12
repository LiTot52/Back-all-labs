const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.get('/', (req, res) => {
	res.send('Добро пожаловать на сервер!');
});

app.get('/api/recipes', (req, res) => {
	res.json([
		{ id: 1, title: 'Борщ', chefId: 1 },
		{ id: 2, title: 'Паста Карбонара', chefId: 2 }
	]);
});

app.get('/api/chefs', (req, res) => {
	res.json([
		{ id: 1, name: 'Иван Петров', specialty: 'Русская кухня' },
		{ id: 2, name: 'Марио Росси', specialty: 'Итальянская кухня' }
	]);
});

app.get('/api/recipes/:id', (req, res) => {
	res.json({ requestedId: req.params.id, status: 'success' });
});

app.use((req, res) => {
	res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});