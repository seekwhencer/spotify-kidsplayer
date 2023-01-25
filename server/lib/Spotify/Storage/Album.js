export default class StorageArtist extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE ARTIST';
        LOG(this.label, 'INIT');

        this.storage = parent;
        this.spotify = this.storage.spotify;
        this.api = this.spotify.api;

        this.table = 'artist';
        this.imagePath = `${STORAGE_CONTAINER_PATH}/images`;
    }

    wrapIdFromURI(artistURI) {
        const splitA = artistURI.split('?');
        const splitB = splitA[0].split('/');
        return splitB[splitB.length - 1];
    }

    getBySpotifyId(spotifyId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT *
                           FROM ${this.table}
                           WHERE spotify_id = '${spotifyId}'`;

            this.storage.connection.query(query, (error, result, fields) => {
                if (error) throw error;

                resolve(result);
            });
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT *
                           FROM ${this.table}
                           WHERE id = ${id}`;

            this.storage.connection.query(query, (error, result, fields) => {
                if (error) throw error;

                resolve(result[0]);
            });
        });
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
                if (!artist) return Promise.resolve(false);

                LOG(this.label, 'ARTIST FETCHED', artist, '');
                return this.create(artist);
            })
            .then(id => {

                return Promise.resolve(id);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    create(artist) {
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
    }

    addImages(id, images) {
        return this.storage.image.add(this.table, id, 'artist_id', images);
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