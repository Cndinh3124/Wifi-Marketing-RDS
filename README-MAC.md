# WiFi Auth Backend - macOS

## Requirements
- Node.js 24+
- npm 11+
- Docker Desktop for Mac

## Install dependencies
cd backend
npm install

If package.json does not exist yet:
npm install @nestjs/config @nestjs/typeorm@11 typeorm@0.3 pg class-validator class-transformer

## packet.json
cat > package.json <<'EOF'
{
  "name": "wifi-auth-backend",
  "version": "1.0.0",
  "description": "WiFi Marketing Authentication Backend",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "format": "prettier --write \"src/**/*.ts\"",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/typeorm": "11.0.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "pg": "^8.16.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.2",
    "typeorm": "0.3.31"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/node": "^22.0.0",
    "ts-node": "^10.9.2",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3"
  }
}
EOF

## Environment
cp .env.example .env

## Start PostgreSQL
From project root:
docker compose up -d

## Start backend
cd backend
npm run start:dev

## API
POST http://localhost:3000/portal/register

Example JSON:
{
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "msnv": "NV001",
  "macAddress": "AA:BB:CC:DD:EE:FF"
}

Development currently uses synchronize=true.
Before production, change to false and use migrations.


