#!/usr/bin/env bash
# Установка demo после git clone: env, зависимости, Docker + restore дампов.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "→ IVA 360 Demo setup"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "→ Создан .env из .env.example"
else
  echo "→ .env уже есть"
fi

echo "→ pnpm install"
pnpm install

echo "→ Docker Compose: Mongo + MinIO + restore seed"
docker compose up -d
echo "→ Ждём replica set, MinIO и дампы…"
docker compose up --wait mongo mongo-restore minio
# minio-init — one-shot; --wait на completed
docker compose up minio-init

echo
echo "✓ Готово. Данные CMS и файлы MinIO восстановлены из backup/."
echo
echo "  Сайт     http://localhost:3033"
echo "  CMS      http://localhost:3333/admin"
echo "  MinIO    http://127.0.0.1:9003   (minioadmin / minioadmin)"
echo "  Логин    admin@iva360.ru / admin"
echo
echo "Запуск приложений:  pnpm dev"
echo "Только фронт/CMS:   pnpm dev:web   или   pnpm dev:cms -- уже после docker"
