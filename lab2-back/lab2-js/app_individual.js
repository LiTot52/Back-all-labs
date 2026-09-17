
// Что надо сделать в первую очередь:
// Средний уровень:
// 1. Поиск(?search =)
// 2. Сортировка(?sort =)
// 3. Пагинация(?page =, ?limit =)
// 4. Валидация типов(400)
// 5. 204 No Content при DELETE

// Что надо сделать для продвинутого уровня:
// 1. PATCH - частичное обновление
// 2. Массовое удаление
// 3. Массовое создание
// 4. Статистика
// 5. Связанные эл - ы
// 6. Логирование запросов в файл
// 7. Глобальный обработчик ошибок

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
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
	res.json({
		count: items.length,
		items: items
	});
});

app.get('/items/:id', (req, res) => {

	const id = parseInt(req.params.id);
	const item = items.find(i => i.id === id);

	if (!item) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}

	res.json(item);
});

app.post('/items', (req, res) => {
	const { name, averageTime, complexity } = req.body;

	if (!name || !averageTime || !complexity) {
		return res.status(400).json({
			error: 'Поля name, averageTime и complexity обязательны'
		});
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

app.delete('/items/:id', (req, res) => {

	const id = parseInt(req.params.id);
	const index = items.findIndex(i => i.id === id);

	if (index === -1) {
		return res.status(404).json({ error: 'Элемент не найден' });
	}

	const deletedItem = items.splice(index, 1)[0];

	res.json({
		message: 'Элемент удалён',
		deleted: deletedItem
	})

});

app.use((req, res) => {
	res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});
