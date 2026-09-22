FROM node:lts-alpine

WORKDIR /app

COPY backend/package.json ./

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
