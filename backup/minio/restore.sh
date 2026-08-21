#!/bin/sh
# Runs inside minio-init on `docker compose up`.
# Creates the bucket, then mirrors backup/minio/data if the bucket is empty.
# Image minio/mc has no grep/find — keep this script POSIX and busybox-light.
set -eu

S3_BUCKET="${S3_BUCKET:-iva360-media}"
SEED_DIR="${MINIO_SEED_DIR:-/seed/data}"

echo "▸ MinIO alias + bucket ${S3_BUCKET}"
mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb --ignore-existing "local/${S3_BUCKET}"
mc anonymous set download "local/${S3_BUCKET}"

# Empty bucket → mc ls prints nothing. Do not use grep (missing in this image).
objects=$(mc ls "local/${S3_BUCKET}" 2>/dev/null || true)
if [ -n "$objects" ]; then
  echo "▸ MinIO bucket already has objects — skip seed"
  exit 0
fi

seed_file=
if [ -d "$SEED_DIR" ]; then
  for f in "$SEED_DIR"/*; do
    if [ -f "$f" ]; then
      seed_file=$f
      break
    fi
  done
fi

if [ -z "$seed_file" ]; then
  echo "▸ No MinIO seed files — skip mirror"
  exit 0
fi

echo "▸ Restoring MinIO seed → local/${S3_BUCKET}"
mc mirror --overwrite "$SEED_DIR" "local/${S3_BUCKET}"
echo "✓ MinIO restore done"
