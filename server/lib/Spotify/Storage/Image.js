import fs from 'fs-extra';
import https from 'https';

export default class StorageImage extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE IMAGE';
        LOG(this.label, 'INIT');

        this.storage = parent;
        this.spotify = this.storage.spotify;
        this.api = this.spotify.api;

        this.imagePath = `${STORAGE_CONTAINER_PATH}/images`;
    }

    add(table, id, field, images) {
        return new Promise((resolve, reject) => {
            const data = [];
            images.forEach(image => {
                const hash = this.createHash(image.url);
                data.push([id, image.height, image.width, image.url, hash]);
                this.downloadImage(image.url, hash);
            });

            const query = `INSERT INTO ${table}_image (${field}, height, width, url, hash)
                           VALUES ?`;

            this.storage.connection.query(query, [data], (error, results, fields) => {
                if (error) throw error;
                resolve(id);
            });
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
        }).catch(err => ERROR(this.label, err));
    }
}