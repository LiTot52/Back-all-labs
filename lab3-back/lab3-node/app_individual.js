const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

app.use((req, res, next) => {
	const startTime = Date.now();

	res.on('finish', () => {
		const duration = Date.now() - startTime;
		console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms IP: ${req.ip}`);

	});

	next();
})



let recipes = [
	{ id: 1, title: "Борщ", time: 90, difficulty: "medium" },
	{ id: 2, title: "Омлет", time: 10, difficulty: "easy" },
	{ id: 3, title: "Блины", time: 40, difficulty: "easy" },
	{ id: 4, title: "Плов", time: 120, difficulty: "hard" },
	{ id: 5, title: "Салат Цезарь", time: 25, difficulty: "easy" },
	{ id: 6, title: "Лазанья", time: 100, difficulty: "hard" },
	{ id: 7, title: "Сырники", time: 30, difficulty: "medium" }
];


let steps = [
	{ id: 1, recipeId: 1, order: 1, text: "Сварить бульон из мяса" },
	{ id: 2, recipeId: 1, order: 2, text: "Обжарить лук, морковь и свёклу" },
	{ id: 3, recipeId: 1, order: 3, text: "Добавить овощи и капусту в бульон, варить 30 минут" },
	{ id: 4, recipeId: 2, order: 1, text: "Взбить яйца с молоком и солью" },
	{ id: 5, recipeId: 2, order: 2, text: "Вылить на разогретую сковороду и жарить под крышкой" },
	{ id: 6, recipeId: 3, order: 1, text: "Смешать яйца, молоко, муку и сахар" },
	{ id: 7, recipeId: 3, order: 2, text: "Жарить на сковороде с двух сторон" },
	{ id: 8, recipeId: 4, order: 1, text: "Обжарить мясо с луком и морковью" },
	{ id: 9, recipeId: 4, order: 2, text: "Добавить рис и воду, тушить до готовности" },
	{ id: 10, recipeId: 5, order: 1, text: "Нарезать курицу и листья салата" },
	{ id: 11, recipeId: 5, order: 2, text: "Заправить соусом и посыпать сыром" },
	{ id: 12, recipeId: 6, order: 1, text: "Приготовить мясной соус и бешамель" },
	{ id: 13, recipeId: 6, order: 2, text: "Собрать слои и запекать 40 минут" },
	{ id: 14, recipeId: 7, order: 1, text: "Смешать творог, яйцо, сахар и муку" },
	{ id: 15, recipeId: 7, order: 2, text: "Сформировать сырники и обжарить" }
];


app.get('/recipes', (req, res) => {

	let result = [...recipes];

	const search = req.query.search;
	const filter = req.query.filter;
	const sort = req.query.sort;
	const order = req.query.order || 'asc';
	const allowedSortFields = ['id', 'title', 'time'];
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	//& Поиск
	if (search) {
		result = result.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
	}

	//& Фильтрация
	if (filter) {
		const [field, value] = filter.split(':');
		const allowedFilterFields = ['difficulty', 'time'];

		if (!allowedFilterFields.includes(field)) {
			return res.status(400).json({
				error: `Фильтровать можно только по: ${allowedFilterFields.join(', ')}`
			});
		}

		result = result.filter(r => String(r[field]) === value);
	}
	//& Сортировка
	if (sort) {
		if (!allowedSortFields.includes(sort)) {
			return res.status(400).json({
				error: `Сортировать можно только по: ${allowedSortFields.join(', ')}`
			});
		}

		if (order !== 'asc' && order !== 'desc') {
			return res.status(400).json({
				error: 'order должен быть asc или desc'
			});
		}

		result.sort((a, b) => {
			if (a[sort] < b[sort]) {
				return -1;
			}
			if (a[sort] > b[sort]) {
				return 1;
			}
			return 0;
		});

		if (order === 'desc') {
			result.reverse();
		}
	}

	//& Палигнация 
	if (page < 1) {
		return res.status(400).json({ error: 'page должен быть >= 1' });
	}

	if (limit < 1 || limit > 100) {
		return res.status(400).json({ error: 'limit должен быть от 1 до 100' });
	}

	const totalPages = Math.ceil(result.length / limit);
	const start = (page - 1) * limit;
	const items = result.slice(start, start + limit);

	res.json({
		count: result.length,
		page,
		limit,
		totalPages,
		items
	});

});


//& Статистика
app.get('/recipes/stats', (req, res) => {
	const times = recipes.map(r => r.time);
	const total = times.reduce((sum, t) => sum + t, 0);

	res.json({
		count: recipes.length,
		averageTime: Math.round(total / recipes.length),
		minTime: Math.min(...times),
		maxTime: Math.max(...times)
	});
})


app.get('/recipes/:id', (req, res) => {
	const id = parseInt(req.params.id);

	if (isNaN(id)) {
		return res.status(400).json({
			error: 'ID должен быть числом'

		});
	}

	const recipe = recipes.find(r => r.id === id);
	if (!recipe) {
		return res.status(404).json({
			error: 'Рецепт не найден'
		});
	}

	res.json(recipe);
});



app.get('/recipes/:id/steps', (req, res) => {

	const id = parseInt(req.params.id);
	if (isNaN(id)) {
		return res.status(400).json({
			error: 'ID должен быть числом'
		});
	}

	const recipe = recipes.find(r => r.id === id);
	if (!recipe) {
		return res.status(404).json({
			error: 'Рецепт не найден'
		});
	}

	const recipeSteps = steps.filter(s => s.recipeId === id)
	res.json({
		recipe: recipe.title,
		steps: recipeSteps,
		count: recipeSteps.length

	});

});


app.get('/difficulties/:diff/recipes', (req, res) => {
	const difficult = req.params.diff;
	const filtered = recipes.filter(r => r.difficulty.toLowerCase() === difficult.toLowerCase());
	res.json({
		difficult,
		count: filtered.length,
		recipes: filtered

	});

});

app.get('/recipes/:id/steps/:order', (req, res) => {
	const id = parseInt(req.params.id);
	const order = parseInt(req.params.order);

	if (isNaN(id) || isNaN(order)) {
		return res.status(400).json({
			error: 'ID и Order должны быть числами'
		});

	}

	const step = steps.find(s => s.recipeId === id && s.order === order);
	if (!step) {
		return res.status(404).json({
			error: 'Этап не найден'
		});
	}

	res.json(step);
});


app.get('/recipes/:id/steps/:order/next', (req, res) => {
	const id = parseInt(req.params.id);
	const order = parseInt(req.params.order);

	if (isNaN(order) || isNaN(id)) {
		return res.status(400).json({
			error: 'ID и Order должны быть числами'
		});
	}

	const currentStep = steps.find(s => s.recipeId === id && s.order === order);
	if (!currentStep) {
		return res.status(404).json({
			error: "Текущий этап не найден"
		});
	}

	const nextstep = steps.find(s => s.recipeId === id && s.order === order + 1);
	if (!nextstep) {
		return res.status(404).json({
			error: "Следующий этап не найден"
		});
	}

	res.json(nextstep);
});


//& Эндпоинт статистики / recipes / stats.
app.get('recipes/stats', (req, res) => {

	avgTime = recipes.reduce((sum, r) => sum + parseInt(r.avgTime), 0) / recipes.length;
	res.json({ count: recipes.length, averageTime: avgTime.toFixed(1) });
});


//& Валидация сложности 

app.get('/difficulties/abc/recipes', (req, res) => {
	const allowedDifficulties = ['easy', 'medium', 'hard'];

	if (!allowedDifficulties.includes(req.params.difficulty.toLowerCase())) {
		return res.status(400).json({
			error: `Сложность должна быть одной из: ${allowedDifficulties.join(', ')}`
		});
	}
});



// Маршрут / difficulties /: diff / recipes /: id(рецепт внутри категории).
app.get('/difficulties/:diff/recipes/:id', (req, res) => {
	const allowedDifficulties = ['easy', 'medium', 'hard'];
	const diff = req.params.diff.toLowerCase();
	const id = parseInt(req.params.id);

	if (!allowedDifficulties.includes(diff)) {
		return res.status(400).json({
			error: `Сложность должна быть одной из: ${allowedDifficulties.join(', ')}`
		});
	}

	if (isNaN(id)) {
		return res.status(400).json({
			error: 'Id должен быть числом'
		});
	}

	const recipe = recipes.find(r => r.id === id && r.difficulty.toLowerCase() === diff);
	if (!recipe) {
		return res.status(404).json({
			error: `Рецепт с id=${id} в категории "${diff}" не найден`
		});
	}

	res.json(recipe);

});



app.use((req, res) => {
	res.status(404).json({ error: 'Маршрут не найден' });
});

//& Глобальный обработчик ошибок 500.
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Внутренняя ошибка сервера' })
})

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});
