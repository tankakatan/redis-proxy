FROM node:alpine

WORKDIR /app

COPY . .

RUN pwd && ls -ahl
RUN npm install

ENV REDIS_HOST redis://cache
ENV REDIS_PORT 6379
ENV SERVER_PORT 4444

CMD ["npm", "start"]
