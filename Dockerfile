FROM node:lts-alpine

WORKDIR /app
COPY . .
COPY package*.json ./
RUN yarn cache clean
RUN yarn 


EXPOSE 3000

CMD ["yarn", "start"]