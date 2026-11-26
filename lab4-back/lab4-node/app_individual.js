const Database = require('better-sqlite3');
const db = new Database('lab4.db');

db.exec(`
  DROP TABLE IF EXISTS recipes;
  CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    time INTEGER,
    difficulty TEXT
  );
`);


const insert = db.prepare('INSERT INTO recipes (title, time, difficulty) VALUES (?, ?, ?)');
insert.run('Борщ', 90, 'средне');
insert.run('Омлет', 10, 'легко');
insert.run('Салат Цезарь', 20, 'легко');
insert.run('Гречневая каша', 25, 'легко');
insert.run('Куриный суп', 60, 'средне');
insert.run('Паста Карбонара', 30, 'средне');
insert.run('Плов', 120, 'сложно');
insert.run('Говядина Веллингтон', 180, 'сложно');
insert.run('Тирамису', 45, 'сложно');
console.log('Данные вставлены: 9 записей');


console.log('\n--- Все рецепты ---');
const all = db.prepare('SELECT * FROM recipes').all();
console.log(all);



console.log('\n--- Рецепты быстрее 30 минут ---');
const fast = db.prepare('SELECT * FROM recipes WHERE time < ?').all(30);
console.log(fast);

db.close();