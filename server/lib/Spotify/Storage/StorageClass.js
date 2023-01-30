export default class StorageClass extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.storage = parent;
        this.spotify = this.storage.spotify;
        this.api = this.spotify.api;
        this.imagePath = `${STORAGE_CONTAINER_PATH}/images`;
    }

    query(query, data) {
        return this.storage
            .connect()
            .then(() => {
                return new Promise((resolve, reject) => {
                    if (data) {
                        this.storage.connection.query(query, (error, result) => {
                            if (error) throw error;

                            this.storage.disconnect();
                            resolve(result);
                        });
                    } else {
                        this.storage.connection.query(query, data, (error, result) => {
                            if (error) throw error;
                            this.storage.disconnect();

                            resolve(result);
                        });
                    }
                });
            });
    }

    getBySpotifyId(spotifyId) {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE spotify_id = '${spotifyId}'`;

        return this.query(query).then(result => Promise.resolve(result[0]));
    }

    getById(id) {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE id = ${id}`;

        return this.query(query).then(result => Promise.resolve(result[0]));
    }

    create(data, images) {
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

    update(id, data) {
        const fields = Object.keys(data);

        const set = fields.map(f => `${f} = ?`).join(', ');

        const query = `UPDATE ${this.table}
                       SET ?
                       WHERE id = ${this.storage.mysql.escape(id)}`;

        const sql = this.storage.mysql.format(query, data);

        LOG('>>>>', sql);
        LOG();
        LOG();
        LOG();


        return this.query(query, data);
    }

}