import StorageClass from './StorageClass.js';

export default class StorageTrack extends StorageClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY STORAGE TRACK';
        LOG(this.label, 'INIT');

        this.table = 'track';
    }
}