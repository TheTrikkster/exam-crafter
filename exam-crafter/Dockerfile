FROM node:21-alpine3.19 AS development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install
RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]