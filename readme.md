# Lumo Market V3

## O'rnatish
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev

## Build
npm run build

## Deployment
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup