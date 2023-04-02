# spotify-kidsplayer | *spotifyd* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)

Just edit the file `spotifyd/spotifyd.conf`

```bash
cp spotifyd/spotifyd.default.conf spotifyd/spotifyd.conf
nano spotifyd/spotifyd.conf
```

> At the moment and after a undefined idle time, the player is not available as active device.  
> If this happens, restart the spotifyd container:

```
docker-compose -f docker-compose-spotifyd.yaml restart spotifyd
``` 
