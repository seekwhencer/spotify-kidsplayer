# spotify-kidsplayer | *Setup* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

## Get it
```
git clone git@github.com:seekwhencer/spotify-kidsplayer.git
cd spotify-kidsplayer

# change file permissions to execute
chmod +x ./setup.sh
./setup.sh
```

- installing docker and docker compose
- create persistent docker volumes

## Config files
- ### `.env`
Used by docker-compose, bash scripts and the server app.
```bash
cp .env.example .env
nano .env
````

- ### `server/config/default.conf`
Used by the server app.
```bash
cp server/config/example.conf server/config/default.conf
nano server/config/default.conf
```
> All properties from the `config/default.conf` can be changed with the in-app setup and will be stored in the database.

- ### `spotifyd/spotifyd.conf`
This file will be generated.
Just edit the `server/config/default.conf`

## Database

[Database Setup](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/DATABASE.md)

## Spotify
