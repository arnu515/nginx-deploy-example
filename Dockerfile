FROM node:14

RUN mkdir /app

WORKDIR /app

COPY package* ./

RUN npm i

COPY . .

ENV NODE_ENV production

ENTRYPOINT [ "npm", "start" ]