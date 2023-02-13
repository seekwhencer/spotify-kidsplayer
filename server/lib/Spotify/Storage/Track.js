import StorageClass from './StorageClass.js';

export default class StorageTrack extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE TRACK';
        LOG(this.label, 'INIT');

        this.table = 'track';
    }

    getOne(id) {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE id = ${id}`;

        return this.query(query).then(result => Promise.resolve(result[0]));
    }

    getAllBy(field, value) {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE ${field} = ${value}
                       ORDER BY track_number ASC`;

        return this.query(query);
    }
}