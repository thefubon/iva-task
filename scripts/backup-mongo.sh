#!/usr/bin/env bash
# Совместимость: полный seed — Mongo + MinIO.
exec "$(cd "$(dirname "$0")" && pwd)/backup-seed.sh"
