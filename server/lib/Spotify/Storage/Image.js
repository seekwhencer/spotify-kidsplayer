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

    deleteByIds(table, ids) {
        return this.getByIds(table, ids)
            .then(images => {
                images.forEach(image => this.deleteFS(image.hash, 'jpg').then(deleted => {
                    LOG(this.label, 'IMAGE FS DELETED', deleted );
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
}