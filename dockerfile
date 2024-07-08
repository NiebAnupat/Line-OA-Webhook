FROM node:22.3.0-slim as base
# RUN corepack enable pnpm

WORKDIR /usr/src/app
COPY package.json  ./
RUN npm install

COPY . ./

RUN npm run build
CMD [ "npm","run", "start" ]