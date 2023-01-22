FROM node:16

RUN npm config set legacy-peer-deps true

WORKDIR /home/node/project/frontend
COPY frontend/package.json .
RUN npm install
COPY . .

WORKDIR /home/node/project
