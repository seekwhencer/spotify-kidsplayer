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

        this.connection = mysql.createConnection({
            host: 'mysql',
            user: `${DB_USER}`,
            password: `${DB_PASS}`,
            database: `${DB_NAME}`
        });

        //this.connect();
        this.image = new StorageImage(this);
        this.artist = new StorageArtist(this);
        //this.album = new StorageAlbum(this);
    }

    connect() {
        this.connection.connect(err => {
            if (err) {
                ERROR(this.label, 'MYSQL CONNECTING: ' + err.stack);
                return;
            }

            LOG(this.label, 'MYSQL CONNECTED AS ID', this.connection.threadId);
        });
    }

    addArtist(artistURI) {
        return this.artist.add(artistURI);
    }

    updateArtist(artistId, data){
        return this.artist.update(artistId, data);
    }
}