# syntax=docker/dockerfile:1

FROM node:18.3.0

WORKDIR /app

COPY ["package.json", "yarn.lock"]

RUN yarn

COPY . .

CMD [ "yarn", "start" ]