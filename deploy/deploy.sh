#!/usr/bin/env bash
# Deploy / update In An Thảo on the VM (run from the repo directory, e.g. ~/apps/inanthao).
#   ./deploy/deploy.sh            # git pull + rebuild + restart
#   ./deploy/deploy.sh --no-pull  # rebuild from the current checkout
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "${1:-}" != "--no-pull" ]]; then
  git pull --ff-only
fi

if [[ ! -f .env ]]; then
  echo ".env missing — copy .env.example and set POSTGRES_PASSWORD / ADMIN_PASSWORD first." >&2
  exit 1
fi

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --remove-orphans
docker image prune -f >/dev/null

echo "--- containers"
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps --format '{{.Name}}\t{{.Status}}'
