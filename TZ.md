# Тестовое задание: IVA 360 Demo

Репозиторий: https://github.com/thefubon/iva-task  
Эталон вёрстки: https://iva360.ru  
UI Kit (обязателен): https://uikit-iva360-react.vercel.app/ · [установка](https://uikit-iva360-react.vercel.app/installation)

Сейчас на сайте только логотип. В CMS уже есть глобалы **Шапка** (`header`) и **Главная** (`homePage`) с легаси-блоком Hero. Виджеты в `apps/web` есть, на страницу не подключены.

---

## 1. Окружение

1. Клонировать репозиторий:

```bash
git clone https://github.com/thefubon/iva-task.git
cd iva-task
```

2. Нужны Node.js `^18.20.2` или `>=20.9.0`, pnpm `^9`/`^10`, Docker + Docker Compose, Git.

3. Развернуть локально (`.env`, зависимости, Docker: Mongo + MinIO, заливка дампов):

```bash
pnpm setup
pnpm dev
```

Эквивалент вручную: `cp .env.example .env` → `pnpm install` → `docker compose up -d` → `pnpm dev`.

Дампы ставятся сами при первом запуске Docker (пустой volume):

- Mongo: `backup/mongo/iva360.archive.gz` (если коллекция `users` пустая)
- MinIO: `backup/minio/data` → бакет `iva360-media` (если бакет пустой)

4. Адреса и доступы

| Сервис | URL |
| --- | --- |
| Сайт | http://localhost:3033 |
| Админка | http://localhost:3033/admin или http://localhost:3333/admin |

- CMS: `admin@iva360.ru` / `admin`
- MinIO console (http://127.0.0.1:9003): `minioadmin` / `minioadmin`

Сброс БД и повторный restore: `docker compose down -v && docker compose up -d`.

---

## 2. Обязательная часть

### 2.1. Новый блок Hero (не легаси)

Легаси: `apps/cms/src/blocks/legacy/LegacyHero.ts`, рендер `apps/web/src/widgets/legacy-promo/`.  
Зарегистрирован в глобале **Главная** (`apps/cms/src/globals/HomePage.ts`, поле `blocks`).

Сделать **новый** блок Hero на базе легаси и подключить его в `pageLayoutBlocks`. Легаси не удалять.

Цель схемы: контент-менеджер не должен ломать вёрстку. В легаси это ломается свободными hex-цветами, произвольным размером заголовка, кастомным фоном кнопок и прочими «оформительскими» полями.

Ожидается:

- контент в CMS (текст, описание, картинка, CTA);
- внешний вид и сетка — на фронте, не из админки;
- без произвольных цветов/CSS от редактора;
- оформление только пресетами (select), если без вариантов нельзя;
- после схемы: `pnpm generate:types`.

### 2.2. Вывести шапку и Hero на сайт

Данные уже есть в CMS (глобалы, не коллекции):

- Шапка: `GET /api/globals/header`
- Главная / блоки: `GET /api/globals/homePage`

Клиент: `apps/web/src/shared/api/cms-globals.ts`.  
Виджеты: `apps/web/src/widgets/header`, `apps/web/src/widgets/home-page`.  
Главная сейчас: `apps/web/src/app/[locale]/(frontend)/page.tsx` — только логотип.

Нужно:

- подключить шапку в layout фронта;
- на главной рендерить блоки из `homePage` (в т.ч. новый Hero);
- страница собирается из widgets, без бизнес-логики в `page.tsx`.

### 2.3. Соответствие iva360.ru

Эталон: шапка и Hero на https://iva360.ru.

Повторить состав, иерархию, состояния (десктоп / мобильное меню, топбар, лого, пункты, кнопки входа). Пиксель-пёрфект не требуется, структура и визуал — как на проде.

### 2.4. Наполнить админку

В CMS (**Шапка**, **Главная**) заполнить контент как на iva360.ru: логотип, меню, топбар, кнопки входа/регистрации, тексты и медиа Hero. Локали `ru` / `en` — по возможности.

### 2.5. Только UI Kit проекта

Только компоненты IVA 360 UI Kit / shadcn `@iva360/*`. Ставить из `apps/web`:

```bash
cd apps/web
pnpm dlx shadcn@latest add @iva360/<name>
```

Импорт: `@/shared/ui/<name>`. Иконки: `@/shared/lib/icons` или Hugeicons. Полиморфизм Base UI: `render`, не `asChild`.

Запрещено: свой UI с нуля, Lucide как основная библиотека, `src/components/ui`, `packages/ui`, правка исходников UI Kit (токены, CVA, `data-slot`, compound-дерево). Недостающий компонент — ставить через CLI в `shared/ui`.

FSD: `app → widgets → features → entities → shared`. Фичи — в `widgets/` / `features/`, не копировать UI Kit в другие слои.

---

## 3. Плюс (не обязательно)

На https://iva360.ru есть тарифные секторы. Вывести их на главной **как данные**: карточки/секции из API, без корзины, модалок заказа и сложной логики покупки.

Источник данных в этом репозитории не заведён — найти самим (сеть iva360.ru, публичное API, CMS). Схема в Payload — только если без неё данные не вывести.

---

## 4. Сдача

- Репозиторий (fork/ветка) + инструкция, если шаги отличаются от `pnpm setup` / `pnpm dev`.
- Локально: шапка и Hero с данными CMS, визуально близко к iva360.ru.
- Админка заполнена.
- UI только из UI Kit проекта.

Критерий Hero: смена текстов/картинок/ссылок в CMS не ломает сетку и типографику на сайте.
