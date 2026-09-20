const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());


app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

let items = [
	{ id: 1, name: 'Товар 1', price: 100, quantity: 5 },
	{ id: 2, name: 'Товар 2', price: 200, quantity: 3 },
	{ id: 3, name: 'Товар 3', price: 300, quantity: 10 }
];

let nextID = 4;


app.get('/items', (req, res) => {
	res.json({
		count: items.length,
		items: items
	});
});


app.get('/items/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const item = items.find(i => i.id === id);

	if (!item) {
		return res.status(404).json({
			error: 'Элемент не найден'
		});
	}
	res.json(item);
});


app.post('/items', (req, res) => {
	const { name, price, quantity } = req.body;

	if (!name || price === undefined) {
		return res.status(400).json({
			error: 'Поля name и price обязательны'
		});
	}

	const newItem = {
		id: nextID++,
		name: name,
		price: price,
		quantity: quantity || 0
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

	const { name, price, quantity } = req.body;

	items[index] = {
		id: id,
		name: name || items[index].name,
		price: price !== undefined ? price : items[index].price,
		quantity: quantity !== undefined ? quantity : items[index].quantity
	};

	res.json(items[index]);
});


app.delete('/items/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const index = items.findIndex(i => i.id === id);

	if (index === -1) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}

	const deleteItem = items.splice(index, 1)[0];

	res.json({
		message: 'Элемент удалён',
		deleted: deleteItem
	});
});


app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});
