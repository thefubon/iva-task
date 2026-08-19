#!/usr/bin/env bash
# Обновить seed: Mongo archive + зеркало MinIO.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

DB_NAME="${MONGO_DB_NAME:-iva360}"
S3_BUCKET="${S3_BUCKET:-iva360-media}"
MONGO_OUT="$ROOT_DIR/backup/mongo/${DB_NAME}.archive.gz"
MINIO_DATA="$ROOT_DIR/backup/minio/data"
REMOTE="/tmp/${DB_NAME}.archive.gz"

mkdir -p "$ROOT_DIR/backup/mongo" "$MINIO_DATA"

echo "▸ mongodump ${DB_NAME} → ${MONGO_OUT}"
docker compose exec -T mongo mongodump --db "$DB_NAME" --gzip --archive="$REMOTE"
docker compose cp "mongo:${REMOTE}" "$MONGO_OUT"

if [[ ! -s "$MONGO_OUT" ]]; then
  echo "✗ Mongo-дамп пустой — ${MONGO_OUT}" >&2
  exit 1
fi

echo "▸ MinIO mirror ${S3_BUCKET} → backup/minio/data"
find "$MINIO_DATA" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
docker compose run --rm --no-deps \
  -v "${MINIO_DATA}:/backup-data" \
  --entrypoint /bin/sh \
  minio-init \
  -c 'mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" && mc mirror --overwrite "local/$S3_BUCKET" /backup-data'

echo "✓ Mongo: $(du -h "$MONGO_OUT" | cut -f1)  ${MONGO_OUT}"
echo "✓ MinIO: $(find "$MINIO_DATA" -type f | wc -l | tr -d ' ') файл(ов) в ${MINIO_DATA}"
