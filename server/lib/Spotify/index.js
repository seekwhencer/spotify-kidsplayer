import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyWebApiServer from 'spotify-web-api-node/src/server-methods.js';

SpotifyWebApi._addMethods = function (methods) {
    for (let i in methods) {
        if (methods.hasOwnProperty(i)) {
            this.prototype[i] = methods[i];
        }
    }
};
SpotifyWebApi._addMethods(SpotifyWebApiServer);

import SpotifyAuth from "./Auth.js";
import SpotifyStorage from "./Storage/index.js";
import SpotifyArtist from "./Controller/Artist.js";
import SpotifyAlbum from "./Controller/Album.js";
import SpotifyTrack from "./Controller/Track.js";
import SpotifyPlayer from "./Controller/Player.js";
import SpotifyFilter from "./Filter.js";

export default class Spotify extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY';
            LOG(this.label, 'INIT');
            this.setup = APP.SETUP;

            /**
             *  the config object
             *  ignoring global config
             */
            this.configMap = {
                clientId: 'SPOTIFY_ID',
                clientSecret: 'SPOTIFY_SECRET',
                redirectUri: 'SPOTIFY_REDIRECT_URI',
                deviceId: 'SPOTIFY_DEVICE_ID',
                deviceName: 'SPOTIFY_DEVICE_NAME'
            };

            // the delegation object
            this.config = new Proxy({}, {
                get: (target, prop, receiver) => this.setup.data[this.configMap[prop]],
                set: (target, prop, value) => {
                    this.setup.data[this.configMap[prop]] = value;
                    return true;
                }
            });

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

            this.createApi();

            // storage
            this.storage = new SpotifyStorage(this);
            this.filter = new SpotifyFilter(this);

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

    createApi() {
        LOG(this.label, 'CREATE API');

        // the api
        this.api = new SpotifyWebApi({
            clientId: this.config.clientId,
            clientSecret: this.config.clientSecret,
            redirectUri: this.config.redirectUri,
        });
    }

    recreateApi() {
        this.createApi();
        new SpotifyAuth(this).then(auth => this.auth = auth);
    }

    getDevices() {
        return this.api
            .getMyDevices()
            .then(data => {
                this.availableDevices = data.body.devices;
                LOG(this.label, 'DEVICES', data.body.devices, '');
                return this.useDevice();
            })
            .catch(error => {
                if (!error)
                    return;

                if (!error.body.error)
                    return;

                if (error.body.error.status === 401)
                    this.emit('access-token-expired');
            });
    }

    useDevice() {
        this.device = this.availableDevices.filter(d => d.name === this.config.deviceName)[0];

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

    updateAlbum(albumId, data) {
        return this.album.update(albumId, data);
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

    saveArtistAlbumsFilter(artistId, data) {
        return this.filter.save(artistId, data);
    }

    toggleArtistHidden(id) {
        return this.artist.toggleHidden(id);
    }

    addArtistImage(artistId, data) {
        return this.artist.addImage(artistId, data);
    }

    setArtistPosterImage(artistId, params) {
        return this.artist.setPosterImage(artistId, params);
    }

    addAlbumImage(albumId, data) {
        return this.album.addImage(albumId, data);
    }
}