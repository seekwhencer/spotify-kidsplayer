import StorageClass from './StorageClass.js';

export default class StorageAlbum extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE ALBUM';
        LOG(this.label, 'INIT');

        this.table = 'album';
    }

    clean() {
        let albums, albumIds, images;

        return this
            .getLost()
            .then(data => {
                albums = data;
                return this.getEmpty();
            })
            .then(data => {
                albums = [...albums, ...data]
                albumIds = albums.map(album => album.id);

                if (albumIds.length === 0)
                    return Promise.resolve(false);

                return this.storage.image.deleteByIds('album', albumIds);
            })
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                images = data;
                return this.deleteIds(albumIds);
            })
            .then(data => Promise.resolve({albums, images}));
    }

    getLost() {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE (SELECT name
                              FROM artist AS artisttable
                              WHERE artisttable.id = ${this.table}.artist_id) IS NULL;`;

        return this.query(query);
    }

    getEmpty() {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE (SELECT name
                              FROM track AS tracktable
                              WHERE tracktable.album_id = album.id LIMIT 1) IS NULL;`;

        return this.query(query);
    }
}