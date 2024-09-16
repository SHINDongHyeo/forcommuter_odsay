FROM node:20.17.0

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install -g npm@10.8.1

RUN npm ci

EXPOSE 3001

# CMD ["node", "index.js"]
