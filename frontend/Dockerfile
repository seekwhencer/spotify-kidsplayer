FROM node:16

RUN npm config set legacy-peer-deps true

WORKDIR /kidsplayer/frontend
COPY frontend/package.json .
RUN npm install
COPY . .

WORKDIR /kidsplayer
