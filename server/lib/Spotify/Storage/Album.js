import StorageClass from './StorageClass.js';

export default class StorageAlbum extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE ALBUM';
        LOG(this.label, 'INIT');

        this.table = 'album';
    }
}