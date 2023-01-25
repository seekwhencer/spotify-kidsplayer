import StorageClass from './StorageClass.js';

export default class StorageArtist extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE ARTIST';
        LOG(this.label, 'INIT');

        this.table = 'artist';
    }

    add(artistURI) {
        const spotifyId = this.wrapIdFromURI(artistURI);

        return this
            .getBySpotifyId(spotifyId)
            .then(data => {
                if (data.length > 0) {
                    LOG(this.label, 'ARTIST EXISTS', spotifyId);
                    return Promise.resolve(false);
                }
                return this.spotify.artist.getById(spotifyId);
            })
            .then(artist => {
                if (!artist)
                    return Promise.resolve(false);

                LOG(this.label, 'ARTIST FETCHED', artist, '');

                return this.create({
                    name: artist.name,
                    spotify_id: artist.id,
                    dt_create: nowDateTime()
                }, artist.images);

            })
            .then(id => {

                return Promise.resolve(id);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    create(data, images) {
        LOG('>>>>', images, '');
        return super.create(data, images, 'artist_id');
    }

    /*create(artist) {
        return new Promise((resolve, reject) => {
            const data = {
                name: artist.name, spotify_id: artist.id, dt_create: nowDateTime()
            }

            const query = `INSERT INTO ${this.table}
                           SET ?`;
            this.storage.connection.query(query, data, (error, results, fields) => {
                if (error) throw error;
                LOG(this.label, results.insertId);

                if (artist.images)
                    return this.addImages(results.insertId, artist.images).then(() => resolve(results.insertId));

                resolve(results.insertId);
            });
        });
    }*/

    addImages(id, images) {
        return super.addImages(id, images, 'artist_id');
    }

    update(artistId, params) {
        return this
            .getById(artistId)
            .then(artist => {
                if (!artist)
                    return Promise.resolve(false);

                return new Promise((resolve, reject) => {
                    const data = {
                        name: params.name, dt_update: nowDateTime()
                    }

                    const query = `UPDATE ${this.table}
                                   SET ?
                                   WHERE id = ${artistId}`;

                    this.storage.connection.query(query, data, (error, results, fields) => {
                        if (error) throw error;
                        const result = {...artist, ...data};
                        LOG(this.label, 'UPDATED:', result, '');

                        resolve(result);
                    });
                });
            });
    }
}