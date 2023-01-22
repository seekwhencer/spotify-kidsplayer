# spotify-kidsplayer | *Server* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

## Run it
- the container
```bash
docker-compose -f docker-compose-server.yml up -d
```

- the server app
```bash
docker exec -it kidsplayer_server /bin/sh -c "/usr/local/bin/node --experimental-modules --experimental-json-modules index.js"
```

### or start the app when starting the container
- stop the container: `docker-compose -f docker-compose-server.yml down`
- edit `docker-compose-server.yml`
- change: `command: "tail -f /dev/null"`to `command: "--experimental-modules --experimental-json-modules index.js"`
- start the container: `docker-compose -f docker-compose-server.yml up -d`

## build binary
- `docker exec -it kidsplayer_server -c "/kidsplayer/build.sh"`
- then a file `kidsplayer_server` was created in the `server/` folder
- use this binary