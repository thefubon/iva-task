# IVA 360 Demo

Чистый **pnpm-monorepo** для тестового задания React-разработчика. В репозитории два приложения и общий пакет: фронтенд на Next.js (FSD + IVA 360 UI Kit) и CMS на Payload 3. Продуктовой логики нет — только каркас, тема и компоненты.

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
| [Docker](https://docs.docker.com/get-docker/) + Docker Compose | актуальной версии | MongoDB 8.0.21, replica set `rs0` |
| Git | любая | клон репозитория |

Браузеры (browserslist): Chrome / Firefox / Edge ≥ 111, Safari ≥ 16.4.

---

## Быстрый старт DEMO

```bash
cp .env.example .env          # PAYLOAD_SECRET уже можно оставить как в примере для локалки
pnpm install
docker compose up -d          # Mongo на :27027 + seed из backup/mongo
pnpm dev                      # CMS :3333 и Web :3033
```

| Сервис | URL |
| --- | --- |
| Сайт (Next.js) | http://localhost:3033 |
| CMS (Payload admin) | http://localhost:3333/admin |
| CMS через rewrite фронта | http://localhost:3033/admin |

**Логин CMS:** `admin@iva360.ru` / `admin`

При первом `docker compose up` сервис `mongo-restore` заливает `backup/mongo/iva360.archive.gz`. Если коллекция `users` уже не пустая, дамп **не** перезаписывается.

Mongo слушает **27027**, чтобы не конфликтовать с локальным `iva360-next` на 27017.

Обновить seed после правок в CMS:

```bash
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
├── backup/mongo/            # seed MongoDB для Docker
├── docker-compose.yml
├── pnpm-workspace.yaml
└── scripts/
    ├── dev.sh
    └── backup-mongo.sh
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
│   └── [locale]/(frontend)/      # ru по умолчанию, /en
├── entities/                     # слой сущностей (пустой в demo)
├── features/                     # слой фич (пустой в demo)
├── widgets/                      # слой виджетов (пустой в demo)
├── shared/
│   ├── api/
│   ├── config/menu.ts
│   ├── lib/                      # utils, icons, hooks, i18n
│   └── ui/                       # компоненты UI Kit
└── proxy.ts                      # locale rewrite (Next.js 16)
```

Алиасы: `@/*` → `apps/web/src/*`. Конфиг shadcn: `apps/web/components.json` (style `base-maia`, registry `@iva360`).

### CMS — `apps/cms`

Чистый Payload: коллекции `users` и `media`, локали `ru` / `en`, Lexical-редактор, MongoDB. Типы пишутся в `packages/shared/src/payload-types.ts` (`pnpm generate:types`).

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

---

## Скрипты (корень)

| Команда | Что делает |
| --- | --- |
| `pnpm dev` | Docker (если нужно) + CMS + Web |
| `pnpm dev:web` / `pnpm dev:cms` | одно приложение |
| `pnpm build` / `pnpm build:web` / `pnpm build:cms` | Turbo / Next build |
| `pnpm typecheck` | TypeScript во всех пакетах |
| `pnpm lint` | ESLint |
| `pnpm generate:types` | Payload → `packages/shared/src/payload-types.ts` |
| `pnpm generate:importmap` | Payload admin import map |
| `pnpm db:backup` | `mongodump` → `backup/mongo/iva360.archive.gz` |

---

## npm-зависимости

Точные версии — в `package.json` пакетов и в `pnpm-lock.yaml`. Ниже состав стека.

### Корень (`iva360`)

**devDependencies:** `turbo`, `typescript` 5.7.3, `eslint`, `eslint-config-next` 16.2.12, `prettier`, `cross-env`, `dotenv` 16.4.7.

### `@iva360/web` — фронтенд

| Пакет | Роль |
| --- | --- |
| `next` **16.2.12** | App Router, SSR |
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
| `next` 16.2.12, `react` 19.2.8 | тот же runtime, что у web |
| `graphql` | GraphQL API Payload |
| `sharp` | обработка изображений |
| `dotenv` | env |

Документация Payload: [payloadcms.com/docs](https://payloadcms.com/docs) · [MongoDB adapter](https://payloadcms.com/docs/database/mongodb).

### `@iva360/shared`

`dotenv`, `zod` — загрузка корневого `.env`, валидация CMS/Web env, локали `ru`/`en`.

### Docker

Образ **`mongo:8.0.21`**, replica set `rs0` (нужен для транзакций Payload). Сервисы: `mongo`, `mongo-init`, `mongo-restore`.

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
