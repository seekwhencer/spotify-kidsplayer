# spotify-kidsplayer
## Goal

> This will be a simplified UI for kids to use spotify.

![alt text](../master/docs/screenshots/artists.png?raw=true "Screenshot Artists")
[... more screenshots](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/SCREENSHOTS.md)

## Get it
```
git clone https://github.com/seekwhencer/spotify-kidsplayer.git
```

## Ingredients
- [Raspberry Pi 4](https://geizhals.de/raspberry-pi-4-modell-b-v54547.html)
- [Desktop Image](https://www.raspberrypi.com/software/operating-systems/)
- [spotifyd](https://github.com/Spotifyd/spotifyd) - An open source headless Spotify client.
- [mariadb](https://docs.linuxserver.io/images/docker-mariadb) - From *linuxserver*
- [phpMyAdmin](https://docs.linuxserver.io/images/docker-phpmyadmin) - From *linuxserver*
- [Docker](https://get.docker.com/) and [Docker Compose](https://github.com/docker/compose/releases/)

## Docs
- [Setup](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/SETUP.md)
- [Database](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/DATABASE.md)
- [spotifyd](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/SPOTIFYD.md)
- [Server](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/SERVER.md)
- [Frontend](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/FRONTEND.md)

> Developed and tested on a Raspberry Pi 4 with 8 GB ram

## Features

- using spotify API
- get automatically all albums, album-tracks from an artist when adding them
- storing artists, artist albums and album tracks in a local database 
- storing images locally
- using text to speech to read titles and names
- set the album type to audiobook, music or podcast
- set album as favorite (like)
- hide / drop unwanted albums
- browse artists and albums
- play automatically the next album from a filtered album list
- setup ui
- setup toggle parent mode = edit mode with PIN
- setup add artist
- hide artist and album options when parent mode is off
- hide disabled albums, show disabled albums in parent mode
- clean database endpoint at `api/clean` - that drops all empty and lost artists, albums and tracks
- edit artist (name, image)
- edit album (name, image, artist)
- start playing album from album overview
- translation / localisation
- configure spotifyd per setup ui

## Roadmap

### Todo

- exit parent mode in setup tab
- loading indicator when adding artist (future request: with one by one output via websockets)
- one play button on album view
- home screen
- icons speak page
- restart spotifyd per ui

### Feature requests

- reorder (change position) the albums per drag and drop
- album view with other albums as list or prev / next image
- drop artist recursive with images
- drop album recursive with images
- bundling the app as binary (actually not working, because

### Bugs / Refactoring

- artist modal as class
