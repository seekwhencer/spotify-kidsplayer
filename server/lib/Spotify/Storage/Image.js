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

            images.forEach(image => {
                const data = {
                    hash: this.createHash(image.url),
                    url: image.url,
                    height: image.height,
                    width: image.width
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

    /*add(table, id, images) {
        return new Promise((resolve, reject) => {
            const data = [];
            const proms = [];

            images.forEach(image => {
                const hash = this.createHash(image.url);
                this.downloadImage(image.url, hash);

                data.push([id, image.height, image.width, image.url, hash]);

                proms.push(this.create({
                    id: artistSpotify.name,
                    spotify_id: artistSpotify.id,
                    dt_create: nowDateTime()
                }));

            });

            //const query = `INSERT INTO ${table}_image (${table}_id, height, width, url, hash) VALUES ?`;

            //LOG('>???', this.storage.mysql.format(query, data), data, '');

            //this.query(query, data).then(() => resolve(id));
        });
    }*/

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