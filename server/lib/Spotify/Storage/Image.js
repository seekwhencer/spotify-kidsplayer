import fs from 'fs-extra';
import https from 'https';
import StorageClass from "./StorageClass.js";

export default class StorageImage extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE IMAGE';
        LOG(this.label, 'INIT');

        this.storage = parent;
        this.spotify = this.storage.spotify;
        this.api = this.spotify.api;

        this.imagePath = `${STORAGE_CONTAINER_PATH}/images`;
    }

    addBulk(table, id, images) {
        return new Promise((resolve, reject) => {
            const proms = [];

            //@TODO get the largest image. not all three

            images = images.filter(image => image.width === 640);

            images.forEach(image => {
                const data = {
                    hash: this.createHash(image.url),
                    url: image.url,
                    height: image.height,
                    width: image.width,
                    is_poster: 1
                };
                data[`${table}_id`] = id;

                this.downloadImage(image.url, data.hash); // not captured

                proms.push(this.create(data, table));
            });

            Promise.all(proms).then(() => resolve());
        });
    }

    create(data, table) {
        const query = `INSERT INTO ${table}_image
                       SET ?`;

        return this.query(query, data).then(result => {
            LOG(this.label, 'INSERTED:', result.insertId);
            return Promise.resolve(result.insertId);
        });
    }

    downloadImage(url, hash) {
        LOG(this.label, 'DOWNLOADING IMAGE', url, 'as', hash);
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
                    writeStream.close(resolve);
                    resolve();
                });
            });
        });
    }

    clean(table, ids) {
        let images;

        return this
            .deleteByFieldIds(table, ids, `${table}_id`)
            .then(data => {
                images = data || [];
                return this.getLowres(table);
            })
            .then(data => {
                const imageIds = data.map(image => image.id);
                images = [...images, ...data];
                return this.deleteByFieldIds(table, imageIds, 'id');
            })
            .then(data => {
                if (!data) {
                    return Promise.resolve(false);
                }
                const imageIds = data.map(image => image.id);
                return this.deleteIds(table, imageIds);
            })
            .then(() => {
                return Promise.resolve(images);
            });
    }

    getById(table, id) {
        const query = `SELECT *
                       FROM ${table}_image
                       WHERE id = ${id}`;

        return this.query(query).then(result => Promise.resolve(result[0]));
    }

    getBy(field, value, table) {
        const query = `SELECT *
                       FROM ${table}
                       WHERE ${field} = '${value}'`;

        return this.query(query);
    }

    getByIds(table, ids) {
        const query = `SELECT *
                       FROM ${table}_image
                       WHERE ${table}_id IN (${ids.join(',')})`;

        return this.query(query);
    }

    getByFieldIds(table, ids, field) {
        const query = `SELECT *
                       FROM ${table}_image
                       WHERE ${field} IN (${ids.join(',')})`;

        return this.query(query);
    }

    getLowres(table) {
        const query = `SELECT *
                       FROM ${table}_image
                       WHERE width < 640`;

        return this.query(query);
    }

    deleteByFieldIds(table, ids, field) {
        if (ids.length === 0) {
            return Promise.resolve(false);
        }

        return this.getByFieldIds(table, ids, field)
            .then(images => {
                images.forEach(image => this.deleteFS(image.hash, 'jpg').then(deleted => {
                    //LOG(this.label, 'IMAGE FS DELETED', deleted);
                }));
                return Promise.resolve(images);
            });
    }

    deleteFS(hash, extension) {
        const filePath = `${this.imagePath}/${hash}.${extension}`;
        return this.exists(hash, extension)
            .then(() => fs.remove(filePath))
            .then(() => Promise.resolve(filePath))
            .catch(err => Promise.resolve(false));
    }

    exists(hash, extension) {
        const filePath = `${this.imagePath}/${hash}.${extension}`;
        return new Promise((resolve, reject) => fs.exists(filePath, e => e ? resolve() : reject()));
    }

    deleteIds(table, ids) {
        if (ids.length === 0)
            return Promise.resolve(false);

        const query = `DELETE
                       FROM ${table}_image
                       WHERE id IN (${ids.join(',')})`;

        return this.query(query);
    }

    setPoster(table, id) {
        let posterImage;

        return this
            .getById(table, id)
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                posterImage = data;

                const query = `UPDATE ${table}_image
                             SET is_poster = 0
                             WHERE ${table}_id = ${posterImage.artist_id}`;

                return this.query(query).then(() => {
                    const query = `UPDATE ${table}_image
                         SET is_poster = 1
                         WHERE id = ${posterImage.id}`;

                    return this.query(query);
                });
            });
    }
}