import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyAuth from "./Auth.js";
import SpotifyStorage from "./Storage/index.js";
import SpotifyArtist from "./Controller/Artist.js";
import SpotifyAlbum from "./Controller/Album.js";
import SpotifyTrack from "./Controller/Track.js";
import SpotifyPlayer from "./Controller/Player.js";

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
                this
                    .getDevices()
                    .then((() => this.useDevice()))
                    .then((() => this.shuffle()));
            });

            this.on('access-token-expired', () => {
                this.auth.emit('access-token-expired');
            });

            // the api
            this.api = new SpotifyWebApi({
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                redirectUri: this.redirectUri,
            });

            // storage
            this.storage = new SpotifyStorage(this);

            // controller
            this.artist = new SpotifyArtist(this);
            this.album = new SpotifyAlbum(this);
            this.track = new SpotifyTrack(this);
            this.player = new SpotifyPlayer(this);

            // authentication
            new SpotifyAuth(this).then(auth => {
                this.auth = auth;
                resolve(this);
            });

        });
    }

    // THIS IS THE CHECK METHOD!!!
    getDevices() {
        return this.api
            .getMyDevices()
            .then(data => {
                this.availableDevices = data.body.devices;
                LOG(this.label, 'DEVICES', data.body.devices, '');
                return Promise.resolve();
            })
            .then(() => {
                return this.useDevice();
            })
            .catch(error => {
                if (error.body.error.status === 401)
                    this.emit('access-token-expired');
            });
    }

    useDevice() {
        const deviceName = SPOTIFY_DEVICE_NAME || 'kidsplayer';
        this.device = this.availableDevices.filter(d => d.name === deviceName)[0];

        if (!this.device)
            return Promise.resolve(false);

        return this.api
            .transferMyPlayback([this.device.id])
            .then((data, err) => {
                LOG(this.label, 'USING DEVICES:', this.device.id);
                return Promise.resolve(data);
            });
    }

    resetSession() {
        this.auth.reset();
    }

    shuffle() {
        return this.api
            .setShuffle(false)
            .then((data, err) => {
                LOG(this.label, 'SHUFFLE OFF');
                return Promise.resolve(true);
            });

    }


    //
    // called from the webserver routes
    //

    addArtist(artistURI) {
        return this.artist.add(artistURI);
    }

    updateArtist(artistId, data) {
        return this.artist.update(artistId, data);
    }

    getArtists() {
        return this.artist.getAll();
    }

    getArtist(id) {
        return this.artist.getOne(id);
    }

    getAlbum(id) {
        return this.album.getOne(id);
    }

    setAlbumType(id, type) {
        return this.album.setType(id, type);
    }

    toggleAlbumHidden(id) {
        return this.album.toggleHidden(id);
    }

    toggleAlbumLiked(id) {
        return this.album.toggleLiked(id);
    }
}