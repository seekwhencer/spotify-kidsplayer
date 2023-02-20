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

## Goal

> This will be a simplified UI for kids to use spotify.  
> At the moment, the setup is done and the spotify authentication works from the server app.

## Features
 
### Server

- Authorize to the spotify api
- Refresh api session periodically
- Get an artist with ALL albums and ALL tracks
- Download and store the artist and album images
- Store the data in a mysql database
- Offer an api for the web-app

### Web-App

- Toggle parent mode = edit mode with PIN
- Display all artists
- Edit artist: name
- Display all albums from an artist
- Filter the artist albums by favorites, audiobooks, music and podcasts
- Hide (delete) unwanted albums
- Toggle (edit) album type: audiobook, music, podcast 
- Edit album: name

## Todo

### Web-App

- change image for artists and album by upload or image url
- reorder (change position) of the albums per drag and drop
- text to speech
- the configuration inputs