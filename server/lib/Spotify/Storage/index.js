import mysql from 'mysql';

import StorageImage from './Image.js';
import StorageArtist from './Artist.js';
import StorageAlbum from './Album.js';

export default class SpotifyStorage extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE';
        LOG(this.label, 'INIT');

        this.spotify = parent;
        this.api = this.spotify.api;

        this.pool = mysql.createPool({
            host: 'localhost',
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

        this.mysql = mysql;

    }

    createConnection() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: `${DB_USER}`,
            password: `${DB_PASS}`,
            database: `${DB_NAME}`
        });

        LOG(this.label, 'CREATE DATABASE CONNECTION');
    }

    connect() {
        this.createConnection();

        return new Promise((resolve, reject) => {
            this.connection.connect(err => {
                if (err) throw err;
                resolve();
            });
        });
    }

    disconnect() {
        this.connection.end((err) => {
            if (err)
                throw err;
            LOG(this.label, 'DISCONNECT DATABASE');
        });
    }


    addArtist(artistURI) {
        return this.artist.add(artistURI);
    }

    updateArtist(artistId, data) {
        return this.artist.update(artistId, data);
    }
}