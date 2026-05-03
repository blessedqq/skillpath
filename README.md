# SkillPath — Онлайн-платформа для обучения

Образовательная платформа в стиле Skillbox, построенная на чистом HTML/CSS/JS c Node.js-бэкендом, MongoDB и Redis в Docker.

---

## Стек технологий

| Слой | Технология |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS (без фреймворков) |
| Backend | Node.js 20 + Express 4 |
| База данных | MongoDB 7 (Mongoose) |
| Кэш / сессии | Redis 7 (ioredis) |
| Аутентификация | JWT (HS256, 7 дней) + Redis blacklist |
| Контейнеризация | Docker + Docker Compose |
| Шрифт | Inter (Google Fonts) |

---

## Структура проекта

```
gradleProject/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── mongo.js          # Подключение к MongoDB
│   │   │   └── redis.js          # Подключение к Redis
│   │   ├── middleware/
│   │   │   └── authenticate.js   # JWT middleware
│   │   ├── models/
│   │   │   ├── User.js           # Модель пользователя
│   │   │   └── Course.js         # Модель курса
│   │   ├── routes/
│   │   │   ├── auth.js           # /api/auth/*
│   │   │   ├── courses.js        # /api/courses/*
│   │   │   └── users.js          # /api/users/*
│   │   └── server.js             # Express приложение
│   ├── mongo-init.js             # Seed-скрипт (при первом запуске)
│   ├── Dockerfile
│   └── package.json
├── css/
│   ├── style.css                 # Глобальные стили
│   ├── auth-modal.css            # Модал авторизации, тосты, превью курсов
│   └── dashboard.css            # Стили личного кабинета
├── js/
│   ├── api.js                    # Клиент к REST API (window.Api)
│   ├── main.js                   # Логика главной страницы
│   └── dashboard.js              # Логика личного кабинета
├── index.html                    # Главная страница
├── dashboard.html                # Личный кабинет (только для авторизованных)
└── docker-compose.yml
```

---

## Быстрый старт

### 1. Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS / Linux)
- Любой статический веб-сервер для фронтенда (например, [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) в VS Code)

### 2. Запустить бэкенд

```bash
docker compose up -d --build
```

Контейнеры:
| Имя | Порт | Описание |
|---|---|---|
| `skillpath_api` | 4000 | Node.js REST API |
| `skillpath_mongo` | 27017 | MongoDB 7 |
| `skillpath_redis` | 6379 | Redis 7 |

Проверка:
```bash
curl http://localhost:4000/api/health
# {"status":"ok"}
```

### 3. Запустить фронтенд

Открой `index.html` через Live Server в VS Code (порт 5500) или любой другой HTTP-сервер:

```bash
npx http-server . -p 5500
```

Открой в браузере: **http://localhost:5500**

---

## API

Base URL: `http://localhost:4000/api`

### Auth

| Метод | Путь | Тело | Авторизация |
|---|---|---|---|
| `POST` | `/auth/register` | `{name, email, password}` | — |
| `POST` | `/auth/login` | `{email, password}` | — |
| `POST` | `/auth/logout` | — | Bearer token |
| `GET` | `/auth/me` | — | Bearer token |

### Courses

| Метод | Путь | Описание | Авторизация |
|---|---|---|---|
| `GET` | `/courses` | Список курсов (без videoUrl) | — |
| `GET` | `/courses?category=dev` | Фильтр по категории | — |
| `GET` | `/courses/:slug` | Полный курс с videoUrl | ✅ |
| `POST` | `/courses/:slug/enroll` | Записаться на курс | ✅ |
| `PATCH` | `/courses/:slug/progress` | Обновить прогресс `{progress: 0-100}` | ✅ |

### Users

| Метод | Путь | Описание | Авторизация |
|---|---|---|---|
| `GET` | `/users/me` | Профиль + enrolledCourses | ✅ |
| `PATCH` | `/users/me` | Изменить имя/аватар | ✅ |

---

## Курсы (текущие)

Все курсы — реальные YouTube плейлисты или полноформатные видео:

| Slug | Название | Канал | Уроков |
|---|---|---|---|
| `react-complete` | React 18 — Полный курс | Net Ninja | 28 |
| `python-cs50p` | CS50P — Python (Harvard) | CS50 | 15 |
| `nodejs-netninja` | Node.js и Express | Net Ninja | 25 |
| `typescript-netninja` | TypeScript | Net Ninja | 20 |
| `git-netninja` | Git и GitHub | Net Ninja | 28 |
| `docker-nana` | Docker для начинающих | TechWorld w/ Nana | — |
| `figma-design` | UI/UX в Figma | DesignCourse | 18 |
| `ml-freecodecamp` | Machine Learning | freeCodeCamp | — |
| `sql-netninja` | MySQL | Net Ninja | 22 |
| `cs50-harvard` | CS50x (Harvard) | CS50 | 12 |

---

## Пересев базы данных

Если нужно сбросить данные о записях пользователей:

```bash
# Скопировать JS в контейнер и выполнить
echo 'db.users.updateMany({}, { $set: { enrolledCourses: [] } })' | \
  docker exec -i skillpath_mongo mongosh \
  "mongodb://skillpath:skillpath_secret@127.0.0.1:27017/skillpath?authSource=admin" --quiet
```

---

## Переменные окружения

Настраиваются в `docker-compose.yml`:

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `MONGO_URI` | `mongodb://...` | Строка подключения MongoDB |
| `REDIS_URL` | `redis://:redis_secret@redis:6379` | Строка подключения Redis |
| `JWT_SECRET` | `super_secret_jwt_key_change_me` | Секрет для JWT (смени в продакшне!) |
| `PORT` | `4000` | Порт API |

---

## Разработка

Для горячей перезагрузки API при изменении файлов:

```bash
cd backend
npm run dev   # nodemon (если установлен)
```

Или пересобрать контейнер:

```bash
docker compose up -d --build api
```
