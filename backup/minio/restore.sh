#!/bin/sh
# Runs inside minio-init on `docker compose up`.
# Creates the bucket, then mirrors backup/minio/data if the bucket is empty.
set -eu

S3_BUCKET="${S3_BUCKET:-iva360-media}"
SEED_DIR="${MINIO_SEED_DIR:-/seed/data}"

echo "▸ MinIO alias + bucket ${S3_BUCKET}"
mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb --ignore-existing "local/${S3_BUCKET}"
mc anonymous set download "local/${S3_BUCKET}"

if mc ls "local/${S3_BUCKET}" | grep -q .; then
  echo "▸ MinIO bucket already has objects — skip seed"
  exit 0
fi

if [ ! -d "$SEED_DIR" ] || [ -z "$(find "$SEED_DIR" -type f 2>/dev/null | head -n 1)" ]; then
  echo "▸ No MinIO seed files — skip mirror"
  exit 0
fi

echo "▸ Restoring MinIO seed → local/${S3_BUCKET}"
mc mirror --overwrite "$SEED_DIR" "local/${S3_BUCKET}"
echo "✓ MinIO restore done"
