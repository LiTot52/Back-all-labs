const Database = require('better-sqlite3');
const db = new Database('lab4.db');

// ============ СОЗДАНИЕ ТАБЛИЦЫ ============
db.exec(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    population INTEGER,
    country TEXT DEFAULT 'Россия',
    area REAL
  )
`);

// ============ ОЧИСТКА (для повторного запуска) ============
db.exec('DELETE FROM cities');

// ============ INSERT - ВСТАВКА ============
const insert = db.prepare('INSERT INTO cities (name, population, country, area) VALUES (?, ?, ?, ?)');
insert.run('Москва', 13000000, 'Россия', 2561);
insert.run('Санкт-Петербург', 5600000, 'Россия', 1439);
insert.run('Новосибирск', 1600000, 'Россия', 505);
insert.run('Екатеринбург', 1500000, 'Россия', 1112);
insert.run('Казань', 1250000, 'Россия', 425);
insert.run('Алматы', 2000000, 'Казахстан', 682);
console.log('Данные вставлены');

// ============ SELECT - ВЫБОРКА ============
console.log('\n--- Все города ---');
const all = db.prepare('SELECT * FROM cities').all();
console.log(all);

console.log('\n--- Города с населением > 1.5 млн ---');
const big = db.prepare('SELECT * FROM cities WHERE population > ?').all(1500000);
console.log(big);

console.log('\n--- Сортировка по населению (убывание) ---');
const sorted = db.prepare('SELECT * FROM cities ORDER BY population DESC').all();
console.log(sorted);

console.log('\n--- Первые 3 города ---');
const limited = db.prepare('SELECT * FROM cities LIMIT 3').all();
console.log(limited);

// ============ UPDATE - ОБНОВЛЕНИЕ ============
db.prepare('UPDATE cities SET population = ? WHERE id = ?').run(13500000, 1);
console.log('\nГород id=1 обновлён');

// ============ DELETE - УДАЛЕНИЕ ============
db.prepare('DELETE FROM cities WHERE id = ?').run(6);
console.log('Город id=6 удалён');

// ============ АГРЕГАЦИЯ ============
console.log('\n--- Статистика ---');
const stats = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(population) as totalPopulation,
    AVG(population) as avgPopulation,
    MAX(population) as maxPopulation,
    MIN(population) as minPopulation
  FROM cities
`).get();
console.log(stats);

// ============ ПОИСК ============
console.log('\n--- Поиск по подстроке "бург" ---');
const search = db.prepare('SELECT * FROM cities WHERE name LIKE ?').all('%бург%');
console.log(search);

// Закрытие БД
db.close();