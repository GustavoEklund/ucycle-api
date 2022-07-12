#!/bin/sh

if [ ! -f ".env" ]; then
    cp .env.sample .env
    echo "[ERROR] .env file not found. Created .env file with sample values. Please edit .env file and restart container."
    exit 0
fi

if [ "$(cat .env)" = "$(cat .env.sample)" ]; then
    echo "[ERROR] .env file is with sample values. Please edit .env file and restart container."
    exit 0
fi

npm install
typeorm migration:run
npm run dev
