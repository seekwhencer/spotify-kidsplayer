export default class StorageClass extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.storage = parent;
        this.spotify = this.storage.spotify;
        this.api = this.spotify.api;
        this.imagePath = `${STORAGE_CONTAINER_PATH}/images`;
    }

    wrapIdFromURI(uri) {
        const splitA = uri.split('?');
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

    create(data, images, field) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ${this.table}
                           SET ?`;
            this.storage.connection.query(query, data, (error, results, fields) => {
                if (error) throw error;
                LOG(this.label, results.insertId);

                if (images)
                    return this.addImages(results.insertId, images).then(() => resolve(results.insertId));

                resolve(results.insertId);
            });
        });
    }

    addImages(id, images, field) {
        return this.storage.image.add(this.table, id, field, images);
    }

}