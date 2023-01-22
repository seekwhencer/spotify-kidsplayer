# spotify-kidsplayer | *Server* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

### start the container - but not the app
- stop the container: `docker-compose -f docker-compose-server.yml down`
- edit `docker-compose-server.yml`
- change: `command: "--experimental-modules --experimental-json-modules index.js"` to `command: "tail -f /dev/null"`
- start the container: `docker-compose -f docker-compose-server.yml up -d`
- start the app: `docker exec -it kidsplayer_server sh -c "/usr/local/bin/node --experimental-modules --experimental-json-modules index.js"`
- stop the app: **CTRL + C**
- 
### build binary
- `docker exec -it kidsplayer_server -c "/kidsplayer/build.sh"`
- then a file `kidsplayer_server` was created in the `server/` folder
- use this binary