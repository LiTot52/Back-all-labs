# Лабораторная работа №3:
## Тема: Маршрутизация, параметры пути и query-параметры

**Студент:** Геграев Ислам Русланович
**Группа:** ПИЖ-б-о-25-2
**Вариант:** 11
**Уровень:** Продвинутый
**Технологии:** Node.js + Express


## Содержание
- [Лабораторная работа №3:](#лабораторная-работа-3)
	- [Тема: Маршрутизация, параметры пути и query-параметры](#тема-маршрутизация-параметры-пути-и-query-параметры)
	- [Содержание](#содержание)
	- [Цель работы](#цель-работы)
	- [Теоретическое обоснование](#теоретическое-обоснование)
	- [Выполнение практического примера](#выполнение-практического-примера)
		- [Команды для запуска](#команды-для-запуска)
		- [Скриншоты работы всех эндпоинтов](#скриншоты-работы-всех-эндпоинтов)
	- [Выполнение индивидуального задания](#выполнение-индивидуального-задания)
		- [Скриншоты работы всех эндпоинтов](#скриншоты-работы-всех-эндпоинтов-1)
	- [Ответы на контрольные вопросы](#ответы-на-контрольные-вопросы)
	- [Вывод:](#вывод)
	- [Рекомендуемые источники](#рекомендуемые-источники)


## Цель работы
Освоить различные способы передачи данных через URL. Научиться строить гибкие маршруты с параметрами пути и query-параметрами, комбинировать их, обрабатывать вложенные ресурсы и валидировать входные данные. Понять разницу между req.params, req.query и req.body.


## Теоретическое обоснование
Маршрутизация (routing) - это механизм сопоставления HTTP-запроса (метод + URL) с кодом-обработчиком на сервере. В Express маршрут описывается как `app.METHOD(PATH, HANDLER)`, где METHOD - HTTP-метод, PATH - путь URL (может содержать параметры), HANDLER - функция, принимающая `req` и `res`. Express проверяет маршруты в порядке объявления, поэтому более специфичные маршруты (например, `/items/stats`) должны идти раньше более общих (`/items/:id`), а wildcard-обработчик 404 - самым последним.

Данные в запросе передаются тремя способами. **Параметры пути** (`req.params`) - часть URL, например `/items/42`; они идентифицируют конкретный ресурс. **Query-параметры** (`req.query`) - пары «ключ=значение» после `?`, например `/items?sort=time&order=desc`; они используются для поиска, фильтрации, сортировки и пагинации. **Тело запроса** (`req.body`) передаётся отдельно от URL в методах POST/PUT/PATCH и используется для создания и обновления ресурсов. Параметры пути и query-параметры всегда приходят строками, поэтому их необходимо приводить к нужному типу.

Вложенные маршруты отражают иерархию ресурсов (`/chefs/1/items/2/steps/3`), позволяя использовать несколько параметров пути одновременно. Поскольку входные данные приходят от клиента, их необходимо валидировать: id - положительное целое число, `page` и `limit` - положительные целые (`limit` ≤ 100), `sort` - из белого списка полей, `order` - только `asc` или `desc`. При неверных параметрах возвращается `400 Bad Request`, при отсутствии ресурса - `404 Not Found`, а необработанные ошибки перехватывает глобальный обработчик и возвращает `500 Internal Server Error`.

| Критерий      | req.params            | req.query         | req.body            |
| ------------- | --------------------- | ----------------- | ------------------- |
| Где в запросе | В пути URL            | После `?`         | В теле запроса      |
| Назначение    | Идентификация ресурса | Фильтрация, поиск | Создание/обновление |
| Тип данных    | Всегда строка         | Всегда строка     | Любой (JSON)        |


## Выполнение практического примера

### Команды для запуска
```bash
mkdir lab3-routing-params
cd lab3-routing-params
npm init -y
npm install express
npm install --save-dev nodemon
npm run dev
```

Скрипты в `package.json`:
```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

**Код сервера (пример с городами):**
```js
// TODO: вставить код практического примера (app.js)
```

### Скриншоты работы всех эндпоинтов

<details>
<summary>1. <code>GET /cities</code> - все города.</summary>

![GET /cities](screenshots/basic/01-cities-all.png)

</details>

<details>
<summary>2. <code>GET /cities/1</code> - город по id (Москва).</summary>

![GET /cities/1](screenshots/basic/02-city-by-id.png)

</details>

<details>
<summary>3. <code>GET /cities/999</code> - несуществующий город (404).</summary>

![GET /cities/999 - 404](screenshots/basic/03-city-404.png)

</details>

<details>
<summary>4. <code>GET /cities/abc</code> - нечисловой id (400).</summary>

![GET /cities/abc - 400](screenshots/basic/04-city-400.png)

</details>

<details>
<summary>5. <code>GET /cities/1/area</code> - площадь города.</summary>

![GET /cities/1/area](screenshots/basic/05-city-area.png)

</details>

<details>
<summary>6. <code>GET /countries/Россия/cities</code> - города страны.</summary>

![GET /countries/Россия/cities](screenshots/basic/06-country-cities.png)

</details>

<details>
<summary>7. <code>GET /cities?search=Москва</code> - поиск.</summary>

![GET /cities?search](screenshots/basic/07-search.png)

</details>

<details>
<summary>8. <code>GET /cities?sort=population&order=desc</code> - сортировка.</summary>

![GET /cities?sort](screenshots/basic/08-sort.png)

</details>

<details>
<summary>9. <code>GET /cities?page=1&limit=2</code> - пагинация.</summary>

![GET /cities?page&limit](screenshots/basic/09-pagination.png)

</details>

<details>
<summary>10. <code>GET /cities/1/details</code> - детали с вложенными данными.</summary>

![GET /cities/1/details](screenshots/basic/10-details.png)

</details>

<details>
<summary>11. <code>GET /countries/Россия/cities/1</code> - город в стране.</summary>

![GET /countries/Россия/cities/1](screenshots/basic/11-country-city.png)

</details>

<details>
<summary>12. <code>GET /anything-else</code> - несуществующий маршрут (404).</summary>

![GET /anything-else - 404](screenshots/basic/12-route-404.png)

</details>


## Выполнение индивидуального задания
**Вариант 11, Продвинутый уровень.**

**Сущность:** Рецепты (recipes): `id`, `title`, `time`, `difficulty`.
**Вложенный ресурс:** шаги рецепта - `/items/:id/steps`.
**Категория:** сложность - `/difficulties/:diff/items`.
**Поля сортировки:** `id`, `title`, `time`. **Поля фильтрации:** `difficulty`, `time`.
**Сущность 2:** шефы (chefs) - `/chefs/:chefId/items`, `/chefs/:chefId/items/:itemId`.
**Статистика:** среднее время приготовления, связь - по сложности.

```js
// TODO: вставить код сервера (app.js)
```

### Скриншоты работы всех эндпоинтов

**Базовый функционал:**

<details>
<summary>1. <code>GET /items</code> - список всех рецептов.</summary>

![GET /items](screenshots/advanced/01-get-all.png)

</details>

<details>
<summary>2. <code>GET /items/2</code> - один рецепт по id.</summary>

![GET /items/2](screenshots/advanced/02-get-by-id.png)

</details>

<details>
<summary>3. <code>GET /items/999</code> - 404 при отсутствии элемента.</summary>

![GET /items/999 - 404](screenshots/advanced/03-get-404.png)

</details>

<details>
<summary>4. <code>GET /items/abc</code> - 400 при нечисловом id.</summary>

![GET /items/abc - 400](screenshots/advanced/04-get-400.png)

</details>

<details>
<summary>5. <code>GET /items/1/steps</code> - шаги рецепта (вложенный ресурс).</summary>

![GET /items/1/steps](screenshots/advanced/05-steps.png)

</details>

<details>
<summary>6. <code>GET /difficulties/Лёгкая/items</code> - рецепты категории (сложности).</summary>

![GET /difficulties/Лёгкая/items](screenshots/advanced/06-difficulty-items.png)

</details>

**Query-параметры и валидация:**

<details>
<summary>7. <code>GET /items?search=паста</code> - поиск по названию.</summary>

![GET /items?search](screenshots/advanced/07-search.png)

</details>

<details>
<summary>8. <code>GET /items?sort=title&order=asc</code> - сортировка.</summary>

![GET /items?sort](screenshots/advanced/08-sort.png)

</details>

<details>
<summary>9. <code>GET /items?sort=abc</code> - 400 (поле вне белого списка).</summary>

![GET /items?sort=abc - 400](screenshots/advanced/09-sort-400.png)

</details>

<details>
<summary>10. <code>GET /items?sort=time&order=up</code> - 400 (неверный order).</summary>

![GET /items?order - 400](screenshots/advanced/10-order-400.png)

</details>

<details>
<summary>11. <code>GET /items?page=1&limit=2</code> - пагинация.</summary>

![GET /items?page&limit](screenshots/advanced/11-pagination.png)

</details>

<details>
<summary>12. <code>GET /items?page=0</code> и <code>GET /items?limit=1000</code> - 400 (неверные page/limit).</summary>

![GET /items?page=0 - 400](screenshots/advanced/12-page-400.png)
![GET /items?limit=1000 - 400](screenshots/advanced/13-limit-400.png)

</details>

<details>
<summary>13. <code>GET /items?filter=difficulty:Лёгкая</code> - фильтрация по полю.</summary>

![GET /items?filter](screenshots/advanced/14-filter.png)

</details>

**Продвинутый уровень:**

<details>
<summary>14. <code>GET /chefs/1/items</code> - рецепты шефа.</summary>

![GET /chefs/1/items](screenshots/advanced/15-chef-items.png)

</details>

<details>
<summary>15. <code>GET /chefs/1/items/2</code> - конкретный рецепт шефа.</summary>

![GET /chefs/1/items/2](screenshots/advanced/16-chef-item.png)

</details>

<details>
<summary>16. <code>GET /chefs/1/items/999</code> - 404 (рецепт не найден у шефа).</summary>

![GET /chefs/1/items/999 - 404](screenshots/advanced/17-chef-item-404.png)

</details>

<details>
<summary>17. <code>GET /chefs/1/items/2/steps/1</code> - маршрут с несколькими параметрами пути.</summary>

![GET /chefs/1/items/2/steps/1](screenshots/advanced/18-multi-params.png)

</details>

<details>
<summary>18. <code>GET /items/stats</code> - статистика (количество, среднее, min/max время).</summary>

![GET /items/stats](screenshots/advanced/19-stats.png)

</details>

<details>
<summary>19. <code>GET /anything-else</code> - wildcard-маршрут, 404.</summary>

![GET /anything-else - 404](screenshots/advanced/20-wildcard-404.png)

</details>

<details>
<summary>20. Вызов ошибки на сервере - глобальный обработчик, 500.</summary>

![error 500](screenshots/advanced/21-error-500.png)

</details>

<details>
<summary>21. Консоль сервера - логирование запросов (метод, URL, время, IP).</summary>

![console log](screenshots/advanced/22-console-log.png)

</details>


## Ответы на контрольные вопросы

**1. Что такое маршрутизация? Как она работает в Express/Flask?**
Это сопоставление HTTP-запроса (метод + URL) с функцией-обработчиком. В Express маршрут задаётся как `app.METHOD(PATH, HANDLER)`, во Flask - декоратором `@app.route('/path', methods=['GET'])`.

**2. Чем отличаются req.params, req.query и req.body?**
`req.params` - параметры из пути (`/items/42`), идентифицируют ресурс; `req.query` - пары после `?`, используются для поиска, фильтрации и сортировки; `req.body` - тело запроса (POST/PUT/PATCH) для создания и обновления данных. params и query всегда строки, body может быть любым JSON.

**3. Что произойдёт, если не преобразовать параметр пути в число?**
Параметр останется строкой, и строгое сравнение `c.id === id` никогда не найдёт элемент (число не равно строке), поэтому сервер вернёт 404 даже для существующего ресурса. Поэтому нужен `parseInt` и проверка `isNaN`.

**4. Какой код ответа возвращается, если ресурс не найден, и какой при невалидном параметре?**
Если ресурс не найден - `404 Not Found`, при невалидном параметре (например, `id=abc` или `limit=1000`) - `400 Bad Request`.

**5. Как работает порядок объявления маршрутов в Express? Почему он важен?**
Express проверяет маршруты сверху вниз и выполняет первый подходящий. Поэтому `/items/stats` нужно объявлять до `/items/:id`, иначе слово `stats` будет принято за id. Wildcard-обработчик 404 должен идти последним.

**6. Как реализовать пагинацию с подсчётом общего количества страниц?**
Из query берутся `page` и `limit`, вычисляется `start = (page - 1) * limit`, берётся срез `result.slice(start, start + limit)`, а общее число страниц - `Math.ceil(result.length / limit)`. В ответ включаются `count`, `page`, `limit`, `totalPages`, `items`.

**7. Как валидировать query-параметры и ограничить максимальное значение limit?**
`sort` проверяется по белому списку (`allowedSortFields.includes(sort)`), `order` - только `asc`/`desc`, `page ≥ 1`, `limit` от 1 до 100. При нарушении возвращается 400 с понятным сообщением. Проверка `limit > 100` защищает API от слишком больших выборок.

**8. Как комбинировать параметры пути и query-параметры в одном запросе?**
Параметры пути определяют ресурс, а query уточняют выборку, например `GET /chefs/1/items?sort=time&order=desc&page=1`. В обработчике `req.params.chefId` используется для выбора коллекции, а `req.query` - для фильтрации, сортировки и пагинации.

**9. Как реализовать вложенные маршруты с несколькими уровнями?**
Описывается путь с несколькими параметрами: `app.get('/chefs/:chefId/items/:itemId/steps/:stepId', ...)`. Все параметры доступны через деструктуризацию `req.params`, и каждый из них валидируется отдельно.

**10. Как реализовать глобальный обработчик ошибок и логирование запросов с IP?**
Глобальный обработчик - middleware с четырьмя аргументами `(err, req, res, next)`, объявленный последним; он возвращает клиенту 500. Для логирования в middleware выводятся `req.method`, `req.originalUrl`, время и `req.ip`.


## Вывод:
В результате освоены различные способы передачи данных через URL, построение гибких маршрутов с параметрами пути и query-параметрами, их комбинирование, обработка вложенных ресурсов и валидация входных данных. Понята разница между req.params, req.query и req.body. Реализованы поиск, сортировка, фильтрация и пагинация, wildcard-маршрут для 404, логирование запросов, эндпоинт статистики и глобальный обработчик ошибок 500. Цель достигнута.


## Рекомендуемые источники

1. **Express - Routing** - https://expressjs.com/en/guide/routing.html
2. **Express - Request** - https://expressjs.com/en/4x/api.html#req
3. **Flask - Routing** - https://flask.palletsprojects.com/en/latest/quickstart/#routing
4. **Flask - Request** - https://flask.palletsprojects.com/en/latest/api/#incoming-request-data
5. **HTTP-методы (MDN)** - https://developer.mozilla.org/ru/docs/Web/HTTP/Methods
6. **URL-параметры (MDN)** - https://developer.mozilla.org/ru/docs/Learn/Common_questions/What_is_a_URL
7. **REST API Tutorial** - https://restfulapi.net/
8. **Postman Learning Center** - https://learning.postman.com/