from flask import Flask, jsonify, request
import time

app = Flask(__name__)
app.json.ensure_ascii = False


@app.before_request
def log_request():
    print(
        f"Received {request.method} request for {request.path} at {time.strftime('%Y-%m-%d %H:%M:%S')}")


@app.route('/')
def home():
    return 'Добро пожаловать на сервер!'


@app.route('/api/status')
def status():
    return jsonify({'status': 'OK', 'framework': 'Flask'})


@app.route('/api/recipes/')
def get_recipes():
    recipes = [
        {'id': 1, 'name': 'Паста Карбонара', 'ingredients': [
            'паста', 'бекон', 'яйца', 'сыр']},
        {'id': 2, 'name': 'Салат Цезарь', 'ingredients': [
            'салат', 'курица', 'пармезан', 'соус Цезарь']},
    ]
    return jsonify(recipes)


@app.route('/api/chefs/')
def get_chefs():
    chefs = [
        {'id': 1, 'name': 'Гордон Рамзи', 'specialty': 'Британская кухня'},
        {'id': 2, 'name': 'Джейми Оливер', 'specialty': 'Итальянская кухня'},
    ]
    return jsonify(chefs)


@app.route('/api/recipes/<int:recipe_id>')
def get_recipe(recipe_id):
    return jsonify({'message': 'Информация о рецепте', 'recipeId': recipe_id})


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Маршрут не найден'}), 404


if __name__ == '__main__':
    app.run(port=3000, debug=True)
