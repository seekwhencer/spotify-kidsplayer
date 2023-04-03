# spotify-kidsplayer | *spotify* | [back](https://github.com/seekwhencer/spotify-kidsplayer/blob/master/README.md)


## At first and once
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
> Open in your browser:

### [http://kidsplayer:3000/api/auth](http://kidsplayer:3000/api/auth)

If it works, your see a json with the access and refresh token. Close this window. Now you can use the app.

## Config parameters

- **SPOTIFY_ID** is the client id from the spotify developers app
- **SPOTIFY_SECRET** is the client secret from the spotify developers app
- **SPOTIFY_REDIRECT_URI** this url receives "the code" from spotify
- **SPOTIFY_DEVICE_ID** will be written automatically, if `SPOTIFY_DEVICE_NAME` matches with `SPOTIFYD_DEVICE_NAME`
- **SPOTIFY_DEVICE_NAME** matching device name. looks in the list of available devices and pick the one with this name. resuting the `SPOTIFY_DEVICE_ID`