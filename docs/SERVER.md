# spotify-kidsplayer | *Server* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

## Config

Edit the file: `server/config/default.conf`

```bash
SPOTIFY_REDIRECT_URI=http://RASPBERRYPI:3000/auth/code
```

> The **redirect uri** is THE SAME how you entered on the spotify developer dashboard for your application.  


## Run it
- start the container
```bash
docker-compose -f docker-compose-server.yml up -d
```

- start the server app
```bash
docker exec -it kidsplayer_server /bin/sh -c "/usr/local/bin/node --experimental-modules --experimental-json-modules index.js"
```

## or start the app when starting the container
- stop the container: 
```
docker-compose -f docker-compose-server.yml down
```
- edit `docker-compose-server.yml`
- change:
    ```
    command: "tail -f /dev/null"
    ```
    to 
    ```
    command: "--experimental-modules --experimental-json-modules index.js"
    ```
- start the container: 
```
docker-compose -f docker-compose-server.yml up -d
```


## Build binary
```
docker exec -it kidsplayer_server -c "/kidsplayer/build.sh"
```
- then a file `kidsplayer_server` was created in the `server/` folder
- use this binary

> at the first time the build process takes a lot of time. maybe an hour or two?!
> after that, the node binary is cached and the bundling is much faster.
