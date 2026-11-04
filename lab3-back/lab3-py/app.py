from flask import Flask, jsonify, request
import time

app = Flask(__name__)
15

cities = [
    {
        "id": 1,
        "name": "Москва",
        "population": 13000000,
        "country": "Россия",
        "area": 2561
    },
    {
        "id": 2,
        "name": "Санкт-Петербург",
        "population": 5600000,
        "country": "Россия",
        "area": 1439
    },
    {
        "id": 3,
        "name": "Новосибирск",
        "population": 1600000,
        "country": "Россия",
        "area": 505
    },
    {
        "id": 4,
        "name": "Екатеринбург",
        "population": 1500000,
        "country": "Россия",
        "area": 1112
    },
    {
        "id": 5,
        "name": "Казань",
        "population": 1250000,
        "country": "Россия",
        "area": 425
    }
]


@app.before_request
def log_request():
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {request.method}{request.path}")

# ============ БАЗОВЫЙ УРОВЕНЬ ============


@app.route('/cities')
def get_cities():
    return jsonify({
        "count": len(cities),
        "cities": cities
    })


@app.route('/cities/<int:city_id>')
def get_city(city_id):
    city = next((c for c in cities if c[
        "id"
    ] == city_id), None)
    if not city:
        return jsonify({
            "error": "Город не найден"
        }), 404
    return jsonify(city)


@app.route('/cities/<int:city_id>/area')
def get_city_area(city_id):
    city = next((c for c in cities if c[
        "id"
    ] == city_id), None)
    if not city:
        return jsonify({
            "error": "Город не найден"
        }), 404

    return jsonify({
        "city": city[
            "name"
        ],
        "area": city[
            "area"
        ],
        "unit": "км²"
    })


@app.route('/countries/<string:country>/cities')
def get_country_cities(country):
    filtered = [c for c in cities if c[
        "country"
    ].lower() == country.lower()
    ]
    return jsonify({
        "country": country,
        "count": len(filtered),
        "cities": filtered
    })


17

# ============ СРЕДНИЙ УРОВЕНЬ ============


@app.route('/cities/search')
def search_cities():
    result = list(cities)

    search = request.args.get('search')
    if search:
        result = [c for c in result if search.lower() in c[
            "name"
        ].lower()
        ]

    country = request.args.get('country')
    if country:
        result = [c for c in result if c[
            "country"
        ].lower() == country.lower()
        ]

    sort = request.args.get('sort')
    order = request.args.get('order', 'asc')

    if sort:
        allowed = ['id', 'name', 'population', 'area'
                   ]
        if sort not in allowed:
            return jsonify({
                "error": f"sort должен быть одним из: {allowed}"
            }), 400
        if order not in ['asc', 'desc'
                         ]:
            return jsonify({
                "error": "order должен быть asc или desc"
            }), 400
        result.sort(key=lambda x: x[sort
                                    ], reverse=(order == 'desc'))

    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)

    if page < 1:
        return jsonify({
            "error": "page должен быть >= 1"
        }), 400
    if limit < 1 or limit > 100:
        return jsonify({
            "error": "limit должен быть от 1 до 100"
        }), 400

    start = (page - 1) * limit
    end = start + limit
    paginated = result[start:end
                       ]

    return jsonify({
        "count": len(result),
        "page": page,
        "limit": limit,
        "totalPages": (len(result) + limit - 1) // limit,
        "cities": paginated
    })

# ============ ПРОДВИНУТЫЙ УРОВЕНЬ ============


@app.route('/cities/<int:city_id>/details')
def get_city_details(city_id):
    # Ищем город в списке
    city = next((c for c in cities if c["id"] == city_id), None)

    # Если города нет - возвращаем 404
    if not city:
        return jsonify({
            "error": "Город не найден"
        }), 404

    # ВАЖНО: Все, что ниже, должно быть внутри функции (с отступом в 4 пробела)
    districts = [
        {
            "id": 1,
            "name": "Центральный",
            "cityId": city_id
        },
        {
            "id": 2,
            "name": "Северный",
            "cityId": city_id
        }
    ]

    return jsonify({
        "city": city,
        "districts": districts,
        "attractions": [
            "Кремль",
            "Парк",
            "Музей"
        ]
    })


@app.route('/countries/<string:country>/cities/<int:city_id>')
def get_country_city(country, city_id):
    city = next((c for c in cities if c[
        "id"
    ] == city_id and c[
        "country"
    ].lower() == country.lower()), None)
    if not city:
        return jsonify({
            "error": f"Город с ID={city_id} не найден в стране {country}"
        }), 404

    return jsonify({
        "country": country,
        "city": city
    })

# ============ ОБРАБОТКА 404 ============


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Маршрут не найден"
    }), 404


if __name__ == '__main__':
    app.run(port=3000, debug=True)
