# IVA 360 Demo

**Техническое задание:** [TZ.md](./TZ.md)

**pnpm-monorepo** для тестового задания React-разработчика. Два приложения и общий пакет: фронтенд на Next.js (FSD + IVA 360 UI Kit) и CMS на Payload 3.

**Сайт** — пустая страница с официальным логотипом IVA 360 (не шире 320px).  
**Админка** — глобалы «Главная» и «Шапка», загрузки в MinIO, seed из `backup/`.

**Правила для ИИ / агента:** полная карта «куда что ставить» — [AGENTS.md](./AGENTS.md). Cursor подхватывает `.cursor/rules/*.mdc` автоматически.

## Ссылки: IVA 360 UI Kit (React)

Официальный реестр shadcn/ui для продуктов экосистемы IVA 360. Стек: **Base UI**, **Hugeicons**, **Next.js 16**, **React 19**, **Feature-Sliced Design**. Код копируется в проект.

| Документ | URL |
| --- | --- |
| Главная, обзор, быстрый старт | [uikit-iva360-react.vercel.app](https://uikit-iva360-react.vercel.app/) |
| Установка (FSD, `components.json`, тема, пути) | [Установка](https://uikit-iva360-react.vercel.app/installation) |
| Registry JSON | `https://uikit-iva360-react.vercel.app/r/{name}.json` |

Компоненты реестра `@iva360/*` (уже установлены в этом demo):

```bash
pnpm dlx shadcn@latest add @iva360/theme-core
pnpm dlx shadcn@latest add @iva360/button @iva360/dialog @iva360/input
```

| Компонент | Команда | Путь в demo |
| --- | --- | --- |
| Тема (oklch-токены) | `@iva360/theme-core` / `@iva360/theme-full` | `apps/web/src/app/assets/css/iva360-theme.css` |
| Utils `cn()` | `@iva360/utils` | `apps/web/src/shared/lib/utils.ts` |
| Icons (Hugeicons) | `@iva360/icons` | `apps/web/src/shared/lib/icons.tsx` |
| Button | `@iva360/button` | `apps/web/src/shared/ui/button/` |
| Input | `@iva360/input` | `apps/web/src/shared/ui/input/` |
| Dialog | `@iva360/dialog` | `apps/web/src/shared/ui/dialog/` |
| Number Field | `@iva360/number-field` | `apps/web/src/shared/ui/number-field/` |
| Separator | `@iva360/separator` | `apps/web/src/shared/ui/separator/` |
| Sheet | `@iva360/sheet` | `apps/web/src/shared/ui/sheet/` |
| Sidebar | `@iva360/sidebar` | `apps/web/src/shared/ui/sidebar/` |
| Skeleton | `@iva360/skeleton` | `apps/web/src/shared/ui/skeleton/` |
| Table | `@iva360/table` | `apps/web/src/shared/ui/table/` |
| Tooltip | `@iva360/tooltip` | `apps/web/src/shared/ui/tooltip/` |

Импорт в коде:

```tsx
import { Button } from '@/shared/ui/button'
import { Download } from '@/shared/lib/icons'
```

Правила UI Kit (нельзя ломать): не удалять oklch-токены и Tailwind-классы, не менять compound-структуру Base UI, ARIA, CVA-варианты, `data-slot`, FSD-пути `shared/ui` и `shared/lib`, не резать тему на CSS-фрагменты. Подробно — на [главной UI Kit](https://uikit-iva360-react.vercel.app/).

Смежные стандарты:

- [shadcn/ui](https://ui.shadcn.com/)
- [Base UI](https://base-ui.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [CVA](https://cva.style/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Hugeicons](https://hugeicons.com/)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)

---

## Системные зависимости (хост)

Нужно установить **до** `pnpm install`:

| Инструмент | Версия | Зачем |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | `^18.20.2` или `>=20.9.0` (в demo проверено на 24) | runtime |
| [pnpm](https://pnpm.io/) | `^9` или `^10` (`packageManager`: **10.28.0**) | monorepo |
| [Docker](https://docs.docker.com/get-docker/) + Docker Compose | актуальной версии | MongoDB 8.0.21 + MinIO |
| Git | любая | клон репозитория |

Браузеры (browserslist): Chrome / Firefox / Edge ≥ 111, Safari ≥ 16.4.

---

## Быстрый старт DEMO

После клона с GitHub достаточно одной команды — она создаст `.env`, поставит зависимости и поднимет Docker с **готовым дампом** (коллекции Payload, глобалы «Главная» / «Шапка», файлы в MinIO).

```bash
git clone https://github.com/thefubon/iva-task.git
cd iva-task
pnpm setup
pnpm dev
```

Эквивалент вручную:

```bash
cp .env.example .env
pnpm install
docker compose up -d          # Mongo :27027 + MinIO :9002 + restore backup/
pnpm dev                      # CMS :3333 и Web :3033
```

| Сервис | URL |
| --- | --- |
| Сайт (Next.js) | http://localhost:3033 |
| CMS (Payload admin) | http://localhost:3333/admin |
| CMS через rewrite фронта | http://localhost:3033/admin |
| MinIO API | http://127.0.0.1:9002 |
| MinIO console | http://127.0.0.1:9003 |

**Логин CMS:** `admin@iva360.ru` / `admin` (в dev включён auto-login)  
**MinIO console:** `minioadmin` / `minioadmin`

Админку удобнее открывать через сайт: http://localhost:3033/admin (rewrite на CMS). Прямой URL: http://localhost:3333/admin.  
В форме Payload кнопка «Сохранить» серая, пока поле не изменено — это не блокировка прав.

При первом `docker compose up` / `pnpm setup`:

- `mongo-restore` заливает `backup/mongo/iva360.archive.gz` (пользователи, медиа-метаданные, глобалы Header и HomePage), если коллекция `users` пустая
- `minio-init` заливает файлы из `backup/minio/data` в бакет `iva360-media`, если бакет пустой

Если volume уже с данными — дамп **не** перезаписывается.

Mongo слушает **27027**, MinIO API **9002** / console **9003**, чтобы не конфликтовать с локальным `iva360-next` (27017 / 9000).

Обновить seed после правок в CMS (Mongo + файлы MinIO):

```bash
pnpm db:backup
```

Перезалить демо-контент в уже запущенную CMS (нужны CMS + MinIO):

```bash
pnpm db:seed
pnpm db:backup
```

Сбросить БД и залить seed заново:

```bash
docker compose down -v && docker compose up -d
```

Отдельный запуск приложений:

```bash
pnpm dev:web    # только Next.js :3033
pnpm dev:cms    # только Payload :3333
```

---

## Архитектура DEMO

```
iva-task/
├── apps/
│   ├── cms/                 # Payload CMS 3.84 (Next.js admin + REST/GraphQL)
│   └── web/                 # Next.js 16 фронтенд, FSD
├── packages/
│   └── shared/              # env, i18n, zod-схемы, payload-types
├── backup/
│   ├── mongo/               # seed MongoDB (users, media, Header, HomePage)
│   └── minio/               # seed файлов загрузок
├── .cursor/rules/           # правила Cursor
├── AGENTS.md
├── docker-compose.yml
├── pnpm-workspace.yaml
└── scripts/
    ├── setup.sh
    ├── dev.sh
    ├── backup-seed.sh
    └── seed-demo.mjs
```

### FSD — `apps/web/src` (как в IVA 360)

Пути совпадают с [инструкцией UI Kit](https://uikit-iva360-react.vercel.app/installation):

```
apps/web/src/
├── app/                          # Next.js App Router
│   ├── layout.tsx
│   ├── providers.tsx             # next-themes
│   ├── assets/css/
│   │   ├── globals.css           # точка входа: Tailwind, тема, шрифты
│   │   └── iva360-theme.css      # дизайн-токены IVA 360 (oklch)
│   └── [locale]/(frontend)/      # главная: логотип IVA 360; ru по умолчанию, /en
├── entities/cms-media/           # резолв URL медиа из Payload
├── features/                     # слой фич (пустой в demo)
├── widgets/                      # header, home-page, legacy-promo (CMS; на сайте не рендерятся)
├── shared/
│   ├── api/
│   ├── config/menu.ts
│   ├── lib/                      # utils, icons, hooks, i18n
│   └── ui/                       # компоненты UI Kit
└── proxy.ts                      # locale rewrite (Next.js 16)
```

Алиасы: `@/*` → `apps/web/src/*`. Конфиг shadcn: `apps/web/components.json` (style `base-maia`, registry `@iva360`).

### CMS — `apps/cms`

Payload: коллекции `users` и `media`, глобалы **`homePage`** (Главная, блоки Legacy Hero) и **`header`** (Шапка), локали `ru` / `en`, Lexical, MongoDB, файлы в MinIO (`@payloadcms/storage-s3`). Типы — `packages/shared/src/payload-types.ts` (`pnpm generate:types`).

---

## Переменные окружения

Файл `.env` в корне (не коммитится). Шаблон: `.env.example`.

| Переменная | Demo-значение | Назначение |
| --- | --- | --- |
| `WEB_PORT` | `3033` | порт Next.js |
| `CMS_PORT` | `3333` | порт Payload |
| `MONGO_PORT` | `27027` | порт Mongo на хосте |
| `MONGODB_URI` | `mongodb://127.0.0.1:27027/iva360?replicaSet=rs0&directConnection=true` | БД CMS |
| `PAYLOAD_SECRET` | случайная строка ≥ 32 символов | JWT админки |
| `CMS_INTERNAL_URL` | `http://localhost:3333` | SSR/rewrites web → CMS |
| `CMS_PUBLIC_URL` | `http://localhost:3333` | публичный origin CMS |
| `WEB_PUBLIC_URL` | `http://localhost:3033` | публичный origin сайта |
| `PAYLOAD_SERVER_URL` | `http://localhost:3033` | origin админки через rewrite |
| `S3_BUCKET` | `iva360-media` | бакет MinIO для загрузок CMS |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | `minioadmin` | креды MinIO |
| `S3_ENDPOINT` | `http://127.0.0.1:9002` | API MinIO |
| `S3_REGION` | `us-east-1` | регион S3-совместимого API |
| `MINIO_API_PORT` / `MINIO_CONSOLE_PORT` | `9002` / `9003` | порты MinIO на хосте |

---

## Скрипты (корень)

| Команда | Что делает |
| --- | --- |
| `pnpm setup` | `.env`, `pnpm install`, Docker + restore дампов |
| `pnpm dev` | Docker (если нужно) + CMS + Web |
| `pnpm dev:web` / `pnpm dev:cms` | одно приложение |
| `pnpm build` / `pnpm build:web` / `pnpm build:cms` | Turbo / Next build |
| `pnpm typecheck` | TypeScript во всех пакетах |
| `pnpm lint` | ESLint |
| `pnpm generate:types` | Payload → `packages/shared/src/payload-types.ts` |
| `pnpm generate:importmap` | Payload admin import map |
| `pnpm db:seed` | демо-контент в уже запущенную CMS |
| `pnpm db:backup` | Mongo + MinIO → `backup/` |

---

## npm-зависимости

Точные версии — в `package.json` пакетов и в `pnpm-lock.yaml`. Ниже состав стека.

### Корень (`iva360`)

**devDependencies:** `turbo`, `typescript` 5.7.3, `eslint`, `eslint-config-next` 16.3.1, `prettier`, `cross-env`, `dotenv` 16.4.7.

### `@iva360/web` — фронтенд

| Пакет | Роль |
| --- | --- |
| `next` **16.3.1** | App Router, SSR |
| `react` / `react-dom` **19.2.8** | UI |
| `@base-ui/react` | headless-примитивы UI Kit |
| `@hugeicons/react`, `@hugeicons/core-free-icons` | иконки |
| `tailwindcss` **4.3**, `@tailwindcss/postcss`, `@tailwindcss/typography` | стили |
| `shadcn` | CLI реестра |
| `class-variance-authority` | варианты компонентов |
| `clsx`, `tailwind-merge` | `cn()` |
| `tw-animate-css` | анимации |
| `next-themes` | светлая / тёмная / системная тема |
| `@tanstack/react-table` | зависимость Table из UI Kit |
| `@iva360/shared` | workspace |
| `babel-plugin-react-compiler` | React Compiler (next.config) |

### `@iva360/cms` — Payload

| Пакет | Роль |
| --- | --- |
| `payload` **3.84.1** | CMS |
| `@payloadcms/next`, `@payloadcms/db-mongodb`, `@payloadcms/richtext-lexical` | Next + Mongo + Lexical |
| `@payloadcms/ui`, `@payloadcms/translations` | админка, i18n (ru) |
| `@payloadcms/storage-s3` | загрузки media в MinIO |
| `next` 16.3.1, `react` 19.2.8 | тот же runtime, что у web |
| `graphql` | GraphQL API Payload |
| `sharp` | обработка изображений |
| `dotenv` | env |

Документация Payload: [payloadcms.com/docs](https://payloadcms.com/docs) · [MongoDB adapter](https://payloadcms.com/docs/database/mongodb).

### `@iva360/shared`

`dotenv`, `zod` — загрузка корневого `.env`, валидация CMS/Web env, локали `ru`/`en`.

### Docker

Образы **`mongo:8.0.21`** (replica set `rs0`) и **MinIO**. Сервисы: `mongo`, `mongo-init`, `mongo-restore`, `minio`, `minio-init`.

---

## Документация стека DEMO

| Тема | Документация |
| --- | --- |
| Next.js 16 | https://nextjs.org/docs |
| React 19 | https://react.dev/ |
| Payload CMS 3 | https://payloadcms.com/docs |
| pnpm workspaces | https://pnpm.io/workspaces |
| Turborepo | https://turbo.build/repo/docs |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| Feature-Sliced Design | https://feature-sliced.design/ |
| MongoDB replica set | https://www.mongodb.com/docs/manual/replication/ |
| Docker Compose | https://docs.docker.com/compose/ |

---

## Что запрещено менять в UI Kit

См. блок правил на [uikit-iva360-react.vercel.app](https://uikit-iva360-react.vercel.app/):

- не удалять CSS-токены `oklch()` и Tailwind-классы компонентов;
- не ломать compound-компоненты Base UI и ARIA;
- не уменьшать CVA-варианты (`variant`, `size`);
- не менять `data-slot` / `data-*`;
- не выносить компоненты из `shared/ui/` и утилиты из `shared/lib/`;
- не менять множители `--radius-sm` … `--radius-4xl` (можно только базовый `--radius`);
- не резать тему на `_base.css` / `_theme.css` / `_utilities.css` — два файла: `globals.css` + `iva360-theme.css`.
