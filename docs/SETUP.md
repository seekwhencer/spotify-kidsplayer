# spotify-kidsplayer | *Setup* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

## Get it
```
git clone git@github.com:seekwhencer/spotify-kidsplayer.git
cd spotify-kidsplayer
chmod +x ./setup.sh
./setup.sh
```

- installing docker and docker compose
- create persistent docker volumes

## Config files
- `.env`
```bash
cp .env.example .env
nano .env
```

- `server/config/default.conf`
```bash
cp server/config/example.conf server/config/default.conf
nano server/config/default.conf
```

- `spotifyd/spotifyd.conf`
```bash
cp spotifyd/spotifyd.default.conf spotifyd/spotifyd.conf
nano spotifyd/spotifyd.conf
```

