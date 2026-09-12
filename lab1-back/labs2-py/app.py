from flask import Flask, jsonify, request
import time
app = Flask(__name__)


@app.before_request
def log_request():
    print(
        f"Received {request.method} request for {request.path} at {time.strftime('%Y-%m-%d %H:%M:%S')}")


@app.route('/')
def home():
    return 'Добро пожаловать на базовый сервер!'


@app.route('/api/status')
def status():
    return jsonify({"status": "ok", "framework": "Flask"})


@app.route('/api/info')
def info():
    return jsonify({"author": "Student", "version": "1.0.0"})


@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    return jsonify({"message": "Информация о пользователе", "userId": user_id})


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Маршрут не найден"}), 404


if __name__ == '__main__':
    app.run(port=3000, debug=True)
