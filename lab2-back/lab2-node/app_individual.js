const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

//& Логирование в отдельный файл
app.use((req, res, next) => {
	const log = (`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	console.log(log.trim());
	fs.appendFile('access.log', log, () => { });
	next();
});

let items = [

	{ id: 1, name: 'Паста Карбонара', averageTime: '30 мин', complexity: 'Средняя' },
	{ id: 2, name: 'Борщ', averageTime: '2 часа', complexity: 'Сложная' },
	{ id: 3, name: 'Омлет с сыром', averageTime: '10 мин', complexity: 'Легкая' },
	{ id: 4, name: 'Салат Цезарь', averageTime: '40 мин', complexity: 'Средняя' },
	{ id: 5, name: 'Шарлотка', averageTime: '1 час', complexity: 'Легкая' }
];

let nextID = 6;

app.get('/items', (req, res) => {

	//~ Поиск
	let result = items;
	if (req.query.search) {
		const search = req.query.search.toLocaleLowerCase();
		result = result.filter(i => i.name.toLocaleLowerCase().includes(search));
	}

	//! Сортировка
	if (req.query.sort) {
		const order = req.query.order === 'desc' ? -1 : 1;
		result = [...result].sort((a, b) => a[req.query.sort] > b[req.query.sort] ? order : -order);
	}

	//? Палигнация
	if (req.query.page || req.query.limit) {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const start = (page - 1) * limit;
		result = result.slice(start, start + limit);
	}

	res.json({
		count: result.length,
		items: result
	});
});

//& Статистика
app.get('/items/stats', (req, res) => {
	const avgTime = items.reduce((sum, i) => sum + parseInt(i.averageTime), 0) / items.length;
	res.json({ count: items.length, averageTime: avgTime.toFixed(1) });
});

app.get('/items/:id', (req, res) => {

	const id = parseInt(req.params.id);
	const item = items.find(i => i.id === id);

	if (!item) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}

	res.json(item);
});

//& Связанные элементы
app.get('/items/:id/related', (req, res) => {
	const item = items.find(i => i.id === parseInt(req.params.id));
	if (!item) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}

	const related = items.filter(i => i.complexity === item.complexity && i.id !== item.id);
	res.json(related);
});

//& Массовое создание
app.post('/items/bulk', (req, res) => {
	const newItems = req.body.map(item => ({ id: nextID++, ...item }))
	items.push(...newItems);
	res.status(201).json(newItems);
});

app.post('/items', (req, res) => {

	const { name, averageTime, complexity } = req.body;

	if (!name || !averageTime || !complexity) {
		return res.status(400).json({
			error: 'Поля name, averageTime и complexity обязательны'
		});
	}

	//& Валидация типов
	if (typeof name !== 'string' || typeof averageTime !== 'string' || typeof complexity !== 'string') {
		return res.status(400).json({ error: 'Поля должны быть строками' });
	}

	const newItem = {
		id: nextID++,
		name: name,
		averageTime: averageTime,
		complexity: complexity
	};

	items.push(newItem);
	res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const index = items.findIndex(i => i.id === id);

	if (index === -1) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}
	const { name, averageTime, complexity } = req.body;

	items[index] = {
		id: id,
		name: name || items[index].name,
		averageTime: averageTime || items[index].averageTime,
		complexity: complexity || items[index].complexity,
	}

	res.json(items[index]);
});

app.patch('/items/:id', (req, res) => {

	const id = parseInt(req.params.id);
	const index = items.findIndex(i => i.id === id);

	if (index === -1) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}

	items[index] = { ...items[index], ...req.body };

	res.json(items[index]);
});

//& Массивное удаление
app.delete('/items', (req, res) => {
	items = [];
	res.status(204).send();
});

app.delete('/items/:id', (req, res) => {

	const id = parseInt(req.params.id);
	const index = items.findIndex(i => i.id === id);

	if (index === -1) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}

	items.splice(index, 1);
	//& 204 No Content
	res.status(204).send();

});

app.use((req, res) => {
	res.status(404).json({ error: 'Маршрут не найден' });
});
//& Глобальный обработчик ошибок
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});