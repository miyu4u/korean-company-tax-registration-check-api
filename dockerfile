FROM node:latest

WORKDIR /app

COPY . .

ENTRYPOINT [ "node", "dist/main" ]