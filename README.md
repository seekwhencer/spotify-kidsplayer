# spotify-kidsplayer

## Ingredients
- [Raspberry Pi 4](https://geizhals.de/raspberry-pi-4-modell-b-v54547.html)
- [Desktop Image](https://www.raspberrypi.com/software/operating-systems/)
- [spotifyd](https://github.com/Spotifyd/spotifyd) - An open source headless Spotify client.
- [mariadb](https://docs.linuxserver.io/images/docker-mariadb) - From *linuxserver*
- [phpMyAdmin](https://docs.linuxserver.io/images/docker-phpmyadmin) - From *linuxserver*
- [Docker](https://get.docker.com/) and [Docker Compose](https://github.com/docker/compose/releases/)

## Docs
- [Setup](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/SETUP.md)
- [Server](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/SERVER.md)
- [Frontend](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/FRONTEND.md)
- [Database](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/DATABASE.md)
- [spotifyd](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/SPOTIFYD.md)

## Server & Frontend


## Setup

```
git clone git@github.com:seekwhencer/spotify-kidsplayer.git
cd spotify-kidsplayer
chmod +x ./setup.sh
./setup.sh
```

## Development

### start the container - but not the app
- stop the container: `docker-compose -f docker-compose-server.yml down`
- edit `docker-compose-server.yml`
- change: `command: "--experimental-modules --experimental-json-modules index.js"` to `command: "tail -f /dev/null"`
- start the container: `docker-compose -f docker-compose-server.yml up -d`
- start the app: `docker exec -it kidsplayer_server sh -c "/usr/local/bin/node --experimental-modules --experimental-json-modules index.js"`
- stop the app: **CTRL + C**

### build binary
- `docker exec -it kidsplayer_server -c "/kidsplayer/build.sh"`
- then a file `kidsplayer_server` was created in the `server/` folder
- use this binary
