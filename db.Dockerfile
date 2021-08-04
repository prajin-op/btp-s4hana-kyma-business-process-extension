FROM node:12-slim AS build

ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install -y openssl python make g++
COPY gen/db/package.json .
RUN npm install

FROM node:12-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install -y openssl
COPY --from=build /usr/src/app/node_modules node_modules
COPY gen/db .
