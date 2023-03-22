import StorageClass from './StorageClass.js';

export default class StorageArtist extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE ARTIST';
        LOG(this.label, 'INIT');

        this.table = 'artist';
    }

    clean() {
        let artists, artistIds, images;

        return this
            .getEmpty()
            .then(data => {
                artists = data;
                artistIds = artists.map(artist => artist.id);
                return this.storage.image.clean('artist', artistIds);
            })
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                images = data;
                return this.deleteIds(artistIds);
            })
            .then(() =>  Promise.resolve({artists, images}));
    }

    getEmpty() {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE (SELECT name
                              FROM album AS albumtable
                              WHERE albumtable.artist_id = ${this.table}.id LIMIT 1) IS NULL;`;

        return this.query(query);
    }
}