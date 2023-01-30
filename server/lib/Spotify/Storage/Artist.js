import StorageClass from './StorageClass.js';

export default class StorageArtist extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE ARTIST';
        LOG(this.label, 'INIT');

        this.table = 'artist';
    }

    create(data, images) {
        return super.create(data, images, 'artist_id');
    }

    addImages(id, images) {
        return super.addImages(id, images, 'artist_id');
    }
}