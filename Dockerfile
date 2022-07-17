FROM node:16-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY gen/srv .
RUN npm install

EXPOSE 4004
USER node
CMD [ "npm", "start" ]