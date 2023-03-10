# spotify-kidsplayer
## Goal

> This will be a simplified UI for kids to use spotify.

![alt text](../master/docs/screenshots/artists.png?raw=true "Screenshot Artists")
![alt text](../master/docs/screenshots/artist.png?raw=true "Screenshot Artist")
![alt text](../master/docs/screenshots/album.png?raw=true "Screenshot Album")

## Get it
```
git clone https://github.com/seekwhencer/spotify-kidsplayer.git
```

> BEWARE: actually it's in development ! 

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

## Roadmap

- toggle parent mode = edit mode with PIN
- change image for artists and album by upload or image url
- reorder (change position) of the albums per drag and drop
- the setup tab
- edit artist FE
- add artist FE
- album view with other albums as list or prev / next image

> At the moment: it is a working pre alpha ;)