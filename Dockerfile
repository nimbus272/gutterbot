FROM node:latest AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci --only=production

FROM node:lts-alpine@sha256:7fb008cfdd48ad114d681348ad3bfcb071413b75b8e6ed4b58d4e158c6378696
ENV NODE_ENV production
RUN apk add dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app/
CMD ["dumb-init", "node", "index.js"]


