#!/usr/bin/env bash
# Runs inside the mongo-restore container on `docker compose up`.
# Restores backup/mongo/iva360.archive.gz only if the DB is empty,
# so local work is not overwritten.
set -euo pipefail

ARCHIVE="${MONGO_ARCHIVE:-/backup/iva360.archive.gz}"
HOST="${MONGO_HOST:-mongo:27017}"
DB_NAME="${MONGO_DB_NAME:-iva360}"

echo "▸ Waiting for replica set PRIMARY…"
ready=0
for _ in $(seq 1 40); do
  if mongosh --host "$HOST" --quiet --eval \
    'try { print(rs.status().members.some(m => m.stateStr === "PRIMARY")) } catch (e) { print(false) }' \
    | grep -q true; then
    ready=1
    break
  fi
  sleep 1
done

if [[ "$ready" -ne 1 ]]; then
  echo "✗ Replica set did not become PRIMARY" >&2
  exit 1
fi

if [[ ! -f "$ARCHIVE" ]]; then
  echo "▸ No dump at ${ARCHIVE} — skip restore"
  exit 0
fi

USERS="$(
  mongosh --host "$HOST" --quiet --eval \
    "print(db.getSiblingDB('${DB_NAME}').users.countDocuments())"
)"
USERS="${USERS//$'\n'/}"

if [[ "$USERS" != "0" ]]; then
  echo "▸ Mongo already has ${USERS} user(s) — skip restore"
  exit 0
fi

echo "▸ Restoring ${ARCHIVE} → ${DB_NAME}"
mongorestore --host "$HOST" --gzip --archive="$ARCHIVE"
echo "✓ Restore done"
