import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyAuth from "./Auth.js";
import SpotifyStorage from "./Storage/index.js";
import SpotifyArtist from "./Artist.js";

export default class Spotify extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY';
            LOG(this.label, 'INIT');

            this.clientId = SPOTIFY_ID;
            this.clientSecret = SPOTIFY_SECRET;
            this.redirectUri = SPOTIFY_REDIRECT_URI;
            this.deviceId = SPOTIFY_DEVICE_ID;

            /**
             * Events
             */
            this.on('auth', () => {
                this.getDevices();
                //this.useDevices([this.deviceId]);
            });


            // the api
            this.api = new SpotifyWebApi({
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                redirectUri: this.redirectUri,
            });

            // storage
            this.storage = new SpotifyStorage(this);
            this.artist = new SpotifyArtist(this);

            // authentication
            new SpotifyAuth(this).then(auth => {
                this.auth = auth;
                resolve(this);
            });

        });
    }

    test() {
        this.api
            .getArtistAlbums('4qhaHyCtCaFugTqT9LzuKp')
            .then((data, err) => {
                if (err)
                    return Promise.reject();

                console.log('Artist albums', data.body);
            })
            .then((data, err) => {
                console.log('Artist albums', data.body);
                return Promise.resolve(data.body);
            });
    }

    getDevices() {
        this.api
            .getMyDevices()
            .then((data, err) => {
                this.availableDevices = data.body.devices;
                LOG(this.label, data.body.devices, 'abc');
            });
    }

    useDevices(ids) {
        this.api
            .transferMyPlayback(ids)
            .then((data, err) => {
                LOG(this.label, 'USING DEVICES:', ids, 'abc');
            });
    }

    resetSession() {
        this.auth.reset();
    }

    addArtist(artistURI) {
        return this.storage.artist.add(artistURI);
    }

    updateArtist(artistId, data){
        return this.storage.artist.update(artistId, data);
    }
}