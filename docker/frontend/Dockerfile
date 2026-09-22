FROM node:lts-alpine

WORKDIR /app

COPY frontend/package.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
