FROM node:20

WORKDIR /app

COPY . .

COPY .env .env

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
