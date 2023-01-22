FROM linuxserver/ffmpeg:latest

RUN apt-get update -y
RUN apt-get install git make libatomic1 python3 build-essential -y

RUN curl -L https://bit.ly/n-install | bash -s -- -y
RUN ln -s "/root/n/bin/n" "/usr/bin/n"
RUN chown -R root:root "/root/.npm"
RUN chmod 777 -R "/root/.npm"
RUN n 16

RUN npm install pkg -g

WORKDIR /kidsplayer/server
COPY server/package.json .
RUN npm install
COPY . .

WORKDIR /kidsplayer/shared
COPY shared/package.json .
RUN npm install
COPY . .

WORKDIR /kidsplayer
ENTRYPOINT [""]