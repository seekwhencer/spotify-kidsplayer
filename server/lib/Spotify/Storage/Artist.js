import fs from 'fs-extra';
import https from 'https';

export default class StorageArtist extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE ARTIST';

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

    getArtist(spotifyId) {
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

    getArtistById(id) {
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

    getSpotify(spotifyId) {
        return this.api
            .getArtist(spotifyId)
            .then(data => {
                //..
                return Promise.resolve(data.body);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    add(artistURI) {
        const spotifyId = this.wrapIdFromURI(artistURI);

        return this
            .getArtist(spotifyId)
            .then(data => {
                if (data.length > 0) {
                    LOG(this.label, 'ARTIST EXISTS', spotifyId);
                    return Promise.resolve(false);
                }
                return this.getSpotify(spotifyId);
            })
            .then(artist => {
                if (!artist) return Promise.resolve(false);

                LOG(this.label, 'ARTIST FETCHED', artist, '');
                return this.create(artist);
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

                if (artist.images) return this.addImages(results.insertId, artist.images).then(() => resolve(results.insertId));

                resolve(results.insertId);
            });
        });
    }

    addImages(id, images) {
        return new Promise((resolve, reject) => {
            const data = [];
            images.forEach(image => {
                const hash = this.createHash(image.url);
                data.push([id, image.height, image.width, image.url, hash]);
                this.downloadImage(image.url, hash);
            });

            const query = `INSERT INTO ${this.table}_image (artist_id, height, width, url, hash)
                           VALUES ?`;

            this.storage.connection.query(query, [data], (error, results, fields) => {
                if (error) throw error;
                resolve(id);
            });
        });
    }

    downloadImage(url, hash) {
        return new Promise((resolve, reject) => {
            https.get(url, response => {
                const statusCode = response.statusCode;

                if (statusCode !== 200) {
                    return reject('Download error!');
                }

                const writeStream = fs.createWriteStream(`${this.imagePath}/${hash}.jpg`);
                response.pipe(writeStream);

                writeStream.on('error', () => reject('Error writing to file!'));
                writeStream.on('finish', () => {
                    writeStream.close(resolve)
                    resolve();
                });
            });
        }).catch(err => ERROR(this.label, err));
    }

    update(artistId, params) {
        return this
            .getArtistById(artistId)
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