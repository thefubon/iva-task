# Правила для агента (нейросети)

Источник истины по UI Kit: [IVA 360 UI Kit](https://uikit-iva360-react.vercel.app/) · [Установка](https://uikit-iva360-react.vercel.app/installation).

Краткие Cursor-правила: `.cursor/rules/*.mdc`. Этот файл — полная карта «куда и что ставить».

---

## 1. Что это за репозиторий

pnpm-monorepo DEMO для тестового задания. Два приложения + shared:

| Пакет | Каталог | Роль |
| --- | --- | --- |
| `@iva360/web` | `apps/web` | Next.js 16, React 19, FSD, UI Kit |
| `@iva360/cms` | `apps/cms` | Payload 3.84, MongoDB |
| `@iva360/shared` | `packages/shared` | env, i18n, zod, сгенерированные Payload-типы |

**Не создавать** `packages/ui`. В этом demo UI Kit ставится в FSD `apps/web/src/shared/ui/` (официальные пути UI Kit), а не в отдельный пакет.

Порты: Web **3033**, CMS **3333**, Mongo **27027**. Логин CMS: `admin@iva360.ru` / `admin`.

---

## 2. Куда устанавливать зависимости npm

Ставить пакет в тот workspace, который делает `import`.

| Нужен в… | Файл | Команда |
| --- | --- | --- |
| Фронт (кнопки, тема, клиент) | `apps/web/package.json` | `pnpm --filter @iva360/web add <pkg>` |
| CMS | `apps/cms/package.json` | `pnpm --filter @iva360/cms add <pkg>` |
| Оба приложения (типы, zod, env) | `packages/shared/package.json` | `pnpm --filter @iva360/shared add <pkg>` |
| Только tooling репо | корневой `package.json` | turbo, eslint, prettier, typescript |

Запрещено дублировать `next`/`react` разных мажорных версий. Сейчас: Next **16.3.1**, React **19.2.8**.

---

## 3. Куда устанавливать IVA 360 UI Kit

Рабочая директория **всегда** `apps/web`. Конфиг: `apps/web/components.json`.

```bash
cd apps/web
pnpm dlx shadcn@latest add @iva360/<component>
```

Registry: `https://uikit-iva360-react.vercel.app/r/{name}.json`. Стиль: **`base-maia`**, иконки **Hugeicons**. Не использовать пресет `b0` и Lucide как основную библиотеку.

### Таблица путей (относительно `apps/web`)

| Артефакт | Куда CLI/агент обязан положить |
| --- | --- |
| Button, Input, Dialog, … | `src/shared/ui/<kebab-name>/index.tsx` |
| `cn()` | `src/shared/lib/utils.ts` |
| Обёртки иконок | `src/shared/lib/icons.tsx` |
| `useIsMobile` и прочие хуки | `src/shared/lib/hooks/` |
| Тема (токены) | `src/app/assets/css/iva360-theme.css` |
| Вход CSS | `src/app/assets/css/globals.css` |
| ThemeProvider | `src/app/providers.tsx` |
| Импорт CSS | `src/app/layout.tsx` → `./assets/css/globals.css` |

### Запрещённые пути для UI Kit

- `src/components/ui/*` (стандарт shadcn без FSD)
- `src/app/globals.css` (файл должен быть в `assets/css/`)
- `packages/ui/**`
- любые `_base.css` / `_theme.css` / `_utilities.css`

### Импорт в коде

```tsx
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Download } from '@/shared/lib/icons'
```

Полиморфизм Base UI: `render={<Link href="…" />}` у `Button`, не `asChild`.

Если registry `@iva360/icons` резолвится в `ui.shadcn.com` — ставить `@iva360/icons` отдельно или скачать JSON с `uikit-iva360-react.vercel.app/r/icons.json` в `src/shared/lib/icons.tsx`.

---

## 4. Куда класть фичи фронта (FSD)

Корень слоёв: `apps/web/src/`.

```
app/            → маршруты Next, layout, CSS, proxy не здесь (proxy.ts рядом с src)
widgets/        → header, footer, page-sections
features/       → auth, search, формы
entities/       → cms-media, user, page
shared/ui       → только примитивы UI Kit + тонкие обёртки
shared/lib      → утилиты, не UI
shared/api      → fetch к Payload / backend
shared/config   → меню, константы
```

Правило слоя: **верхний слой импортирует нижний**, не наоборот.

```
app → widgets → features → entities → shared
```

Слайс: `ui/`, `lib/`, `model/`, публичный `index.ts`. Страница в `app/[locale]/(frontend)/` собирается из widgets, без бизнес-логики в page.tsx.

Локали: `ru` без префикса (rewrite в `src/proxy.ts`), `en` → `/en`.

---

## 5. Куда класть CMS

Корень: `apps/cms/src/`.

| Тип | Каталог | Регистрация |
| --- | --- | --- |
| Коллекция | `collections/Foo.ts` | `payload.config.ts` → `collections` |
| Global | `globals/Bar.ts` | `globals` |
| Поле | `fields/` | импорт в коллекцию |
| Access | `access/` | в collection `access` |
| Хук | `hooks/` | collection/global hooks |
| Admin React | `components/admin/` | `admin.components` + importMap |

После изменения схемы:

```bash
pnpm generate:types      # → packages/shared/src/payload-types.ts
pnpm generate:importmap  # → apps/cms/src/app/admin/importMap.js
```

`payload-types.ts` и сгенерированные `app/admin/**`, `app/api/**` Payload не редактировать вручную, кроме осознанного исключения.

Админ из дампа: не затирать Mongo, если `users` уже есть (`backup/mongo/restore.sh`).

---

## 6. CSS: золотое правило двух файлов

`apps/web/src/app/assets/css/`:

1. **`globals.css`** — Tailwind, плагины, шрифты, `@import './iva360-theme.css'`.
2. **`iva360-theme.css`** — все oklch-токены. Не резать.

Нельзя менять множители radius (`--radius-sm` = `calc(var(--radius) * 0.6)` и далее). Можно менять только `--radius`.

Не удалять токены бренда/продуктов (`--meetings-primary`, `--brand-500`, …) — ломается палитра между продуктами IVA 360.

---

## 7. Что нельзя делать с UI-компонентами

Полный список с обоснованием: [главная UI Kit](https://uikit-iva360-react.vercel.app/).

- Не выкидывать Tailwind-классы состояний и тёмной темы.
- Не ломать compound-дерево Base UI (Dialog, Sheet, Sidebar, NumberField).
- Не удалять ARIA и `sr-only`.
- Не урезать CVA `variant` / `size` (в т.ч. `meetings-primary`, `messenger-primary`, …).
- Не трогать `data-slot` / `data-*`.
- Не переносить файлы из `shared/ui` и `shared/lib` в другие слои «для удобства».

Допустимо: тонкая обёртка в `widgets/` или `features/`, которая **импортирует** `@/shared/ui/button`, не копирует его.

---

## 8. Docker / Mongo / seed

| Файл | Назначение |
| --- | --- |
| `docker-compose.yml` | mongo 8.0.21 + rs0 + restore + MinIO |
| `backup/mongo/iva360.archive.gz` | seed Mongo (users, media, globals), коммитится |
| `backup/mongo/restore.sh` | restore только если `users` пустой |
| `backup/minio/data` | seed файлов загрузок, коммитится |
| `backup/minio/restore.sh` | mirror в бакет, если он пустой |
| `pnpm setup` | клон → env, install, Docker + дампы |
| `pnpm db:backup` | обновить seed (Mongo + MinIO) |

`.env` не коммитить. Шаблон: `.env.example`.

Сброс локальной БД: `docker compose down -v && docker compose up -d`.

---

## 9. Чеклист перед правкой

1. Это UI Kit? → CLI `@iva360/*` в `apps/web`, путь `shared/ui/<name>/index.tsx`.
2. Это фича сайта? → `features/` или `widgets/`, не в `shared/ui`.
3. Это коллекция CMS? → `apps/cms/src/collections` + `payload.config.ts` + `generate:types`.
4. Это общее между cms и web? → `packages/shared`.
5. Это npm? → `package.json` того пакета, который импортирует.
6. Это цвет/радиус? → только токены темы, не хардкод hex.
