import mysql from 'mysql';

import StorageImage from './Image.js';
import StorageArtist from './Artist.js';
import StorageAlbum from './Album.js';
import StorageTrack from './Track.js';

export default class SpotifyStorage extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE';
        LOG(this.label, 'INIT');

        this.spotify = parent;
        this.api = this.spotify.api;

        this.pool = mysql.createPool({
            host: `${DB_HOST}`,
            user: `${DB_USER}`,
            password: `${DB_PASS}`,
            database: `${DB_NAME}`,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0
        });

        this.image = new StorageImage(this);
        this.artist = new StorageArtist(this);
        this.album = new StorageAlbum(this);
        this.track = new StorageTrack(this);

        this.mysql = mysql;

    }

    addArtist(artistURI) {
        return this.artist.add(artistURI);
    }

    updateArtist(artistId, data) {
        return this.artist.update(artistId, data);
    }

    clean() {

        let tracks, albums, artists;
        return this.track
            .clean()
            .then(data => {
                tracks = data;
                return this.album.clean();
            })
            .then(data => {
                albums = data;
                return this.artist.clean();
            })
            .then(data => {
                artists = data;

                return Promise.resolve({
                    tracks: tracks,
                    albums: albums,
                    artists: artists
                });
            });
    }

}