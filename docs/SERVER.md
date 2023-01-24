# spotify-kidsplayer | *Server* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

## Config

Edit the file: `server/config/default.conf`

```bash
SPOTIFY_REDIRECT_URI=http://RASPBERRYPI:PORT/auth/code
```

> The **redirect uri** is THE SAME how you entered on the spotify developer dashboard for your application.  
>   
> This is an important thing. The URL MUST BE REACHABLE with your browser - BUT MUST NOT reachable for spotify.

## Run it
- the container
```bash
docker-compose -f docker-compose-server.yml up -d
```


## Spotify authentication

Open:

> [http://RASPBERRYPI:PORT/auth](http://RASPBERRYPI:PORT/auth)

- If no session is alive, the request will be redirected to spotify's authentication page.
- Please login to your spotify account and grand the access request.
- When you submit the request, spotify will redirect the page back to: the **redirectURI** - BUT with `the code` as get parameters.
- The server app receives that code and getting an access- and refresh token with a lifetime from spotify.
- Every X seconds the access token will be refreshed.



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

> at the first time the build process takes a lot of time. maybe an hour or two?!
> after that, the node binary is cached and the bundling is much faster.
