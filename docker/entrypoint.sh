#!/bin/sh
set -e

mkdir -p /app/data /app/public/uploads

echo ">> Veritabanı senkronize ediliyor..."
node ./node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma

echo ">> İlk kurulum kontrolü..."
node ./scripts/seed-if-empty.mjs

echo ">> By Balet menü başlatılıyor (port ${PORT:-3000})..."
exec node server.js
