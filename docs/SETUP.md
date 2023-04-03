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
### `.env`
```bash
cp .env.example .env
nano .env
````

### `server/config/default.conf`
```bash
cp server/config/example.conf server/config/default.conf
nano server/config/default.conf
```
> All properties from the `config/default.conf` can be changed with the in-app setup and will be stored in the database.


### `spotifyd/spotifyd.conf`
```bash
cp spotifyd/spotifyd.default.conf spotifyd/spotifyd.conf
nano spotifyd/spotifyd.conf
```

## Database

[Database Setup](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/docs/DATABASE.md)

## Spotify

- Login here: https://developer.spotify.com
- Create app
- **Redirect URI** is: 
    ```
    http://kidsplayer:3000/api/auth/code
    ```

- Replace the `kidsplayer` hostname with your own hostname of your raspberry pi. 
  This url must not be reachable for spotify. The url must be reachable four you in the browser.
  
The **Redirect URI** can be changed per in app setup or per config file as `SPOTIFY_REDIRECT_URI`.

When you created the app, just copy the **Client ID** and **Client Secret** in your `server/config/default.conf`

```
SPOTIFY_ID=
SPOTIFY_SECRET=
```

Now restart the server app. After that, you can change the credentials with the in app setup.

![alt text](../../master/docs/screenshots/setup-spotify.png?raw=true "Screenshot Setup spotify")

> Now authenticate with the api to create an access and refresh token.  
> You have to be logged in here: https://developer.spotify.com  
> Open in your browser:

### [http://kidsplayer:3000/api/auth](http://kidsplayer:3000/api/auth)

If it works, your see a json with the access and refresh token. Close this window. Now you can use the app.