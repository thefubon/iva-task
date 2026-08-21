#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WEB_PORT="${WEB_PORT:-3033}"
CMS_PORT="${CMS_PORT:-3333}"
SKIP_DOCKER=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-docker)
      SKIP_DOCKER=1
      shift
      ;;
    -h | --help)
      cat <<'EOF'
Использование: ./scripts/dev.sh [--no-docker]

Локальный dev-стек:
  1. Docker Compose: MongoDB (replica set rs0) + MinIO
  2. CMS (:3333) + Web (:3033)

  --no-docker   Не поднимать docker compose (сервисы уже запущены)
EOF
      exit 0
      ;;
    *)
      echo "Неизвестный аргумент: $1" >&2
      exit 1
      ;;
  esac
done

cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ "$SKIP_DOCKER" -eq 0 ]]; then
  echo "→ Docker Compose: MongoDB + MinIO + seed из backup/"
  docker compose up -d
  echo "→ Ждём replica set и MinIO…"
  # --wait только для долгоживущих сервисов: one-shot restore/init
  # в Compose v5 считаются ошибкой, если контейнер завершился с кодом 0.
  docker compose up --wait mongo minio
  docker compose up mongo-restore
  docker compose up minio-init
fi

echo "→ CMS  http://localhost:${CMS_PORT}/admin"
echo "→ Web  http://localhost:${WEB_PORT}"
echo "   login: admin@iva360.ru / admin"

pnpm --filter @iva360/cms dev &
CMS_PID=$!
pnpm --filter @iva360/web dev &
WEB_PID=$!

cleanup() {
  kill "$CMS_PID" "$WEB_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait
