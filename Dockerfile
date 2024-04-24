FROM node:20-alpine

WORKDIR /usr/src/vidly

COPY package*.json ./

RUN npm install

COPY src src

COPY babel.config.json babel.config.json

EXPOSE 3000

CMD ["npm", "start"]