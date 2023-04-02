# spotify-kidsplayer | *Frontend* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

This container is only for development. If you want to extend the user interface, just edit these files here in:
```
frontend/src
```

## Run it
- start the container
```bash
docker-compose -f docker-compose-frontend.yml up -d
```

- start the frontend build pipeline with proxy (browsersync)
```bash
docker exec -it kidsplayer-frontend /bin/sh -c "/usr/local/bin/node --experimental-modules --experimental-json-modules config/WebpackConfigDev.js"
```

- open in your browser

### http://RASPBERRYPI:4000

> Now you can work on the sources in `frontend/src`