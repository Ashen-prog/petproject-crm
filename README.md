# CRM Pet Project

Этот проект — простая CRM-система, разработанная на базе React с использованием Redux Toolkit и React Router. Проект предназначен для управления записями, пользователями и рабочими процессами в малых командах или для личного использования.

## Основные возможности
- Аутентификация пользователей
- Регистрация новых пользователей
- Управление записями и журналами
- Модальные окна для взаимодействия
- Навигация по рабочему пространству

## Структура проекта
```
petproject-crm/
├── public/                # Статические файлы и шаблон index.html
├── src/
│   ├── components/        # Основные компоненты интерфейса
│   │   ├── Auth.js, Header.js, ...
│   │   ├── Registration/  # Компоненты регистрации
│   │   ├── SideBar/       # Боковое меню и календарь
│   │   ├── UI/            # Универсальные UI-компоненты (модальные окна и др.)
│   │   └── WorkSpace/     # Рабочее пространство, журнал, формы
│   ├── store/             # Redux slices и хранилище состояния
│   │   ├── AuthSlice.js, dateSlice.js, ...
│   │   └── store.js
│   ├── App.js             # Главный компонент приложения
│   ├── index.js           # Точка входа
│   └── ...
├── package.json           # Зависимости и скрипты
└── README.md              # Документация проекта
```

## Быстрый старт
1. Клонируйте репозиторий:
   ```sh
   git clone <ссылка на ваш репозиторий>
   cd petproject-crm
   ```
2. Установите зависимости:
   ```sh
   npm install
   ```
3. Запустите проект в режиме разработки:
   ```sh
   npm start
   ```
   Приложение будет доступно по адресу http://localhost:3000

## Основные npm-скрипты
- `npm start` — запуск приложения в режиме разработки
- `npm run build` — сборка production-версии
- `npm test` — запуск тестов
- `npm run eject` — извлечение конфигурации (не рекомендуется без необходимости)

## Зависимости
- React 19+
- Redux Toolkit
- React Router DOM
- React Scripts
- @testing-library (для тестирования)

## Тестирование
Для запуска тестов используйте команду:
```sh
npm test
```

## Развертывание
Для сборки production-версии выполните:
```sh
npm run build
```

## Документация и полезные ссылки
- [Документация Create React App](https://facebook.github.io/create-react-app/docs/getting-started)
- [Документация React](https://reactjs.org/)
- [Документация Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)

## License
This project is licensed under the terms of the MIT License. See the [LICENSE](LICENSE) file for details.

---

Если у вас есть предложения по улучшению или вы нашли ошибку, создайте issue или отправьте pull request.
