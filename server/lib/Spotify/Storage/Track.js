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

    clean() {
        let tracks;

        return this
            .getLost()
            .then(data => {
                tracks = data;
                const ids = tracks.map(track => track.id);

                if (ids.length === 0)
                    return Promise.resolve(false);

                return this.deleteIds(ids);
            })
            .then(deleted => {
                return Promise.resolve(tracks);
            });
    }

    getLost() {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE (SELECT name from album AS albumtable WHERE albumtable.id = track.album_id) IS NULL;`;
        return this.query(query);
    }
}