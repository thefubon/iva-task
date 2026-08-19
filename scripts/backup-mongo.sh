#!/usr/bin/env bash
# Обновить seed-дамп backup/mongo/iva360.archive.gz из текущего Docker Mongo.
# mongodump запускается внутри контейнера — утилита на хосте не нужна.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

DB_NAME="${MONGO_DB_NAME:-iva360}"
OUT="$ROOT_DIR/backup/mongo/${DB_NAME}.archive.gz"
REMOTE="/tmp/${DB_NAME}.archive.gz"

mkdir -p "$ROOT_DIR/backup/mongo"

echo "▸ mongodump ${DB_NAME} → ${OUT}"
docker compose exec -T mongo mongodump --db "$DB_NAME" --gzip --archive="$REMOTE"
docker compose cp "mongo:${REMOTE}" "$OUT"

if [[ ! -s "$OUT" ]]; then
  echo "✗ Бэкап пустой — ${OUT}" >&2
  exit 1
fi

echo "✓ Готово: $(du -h "$OUT" | cut -f1) — ${OUT}"
