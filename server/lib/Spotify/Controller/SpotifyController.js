export default class SpotifyController extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.spotify = parent;
    }

    wrapIdFromURI(uri) {
        const splitA = uri.split('?');
        const splitB = splitA[0].split('/');
        return splitB[splitB.length - 1];
    }

    get api() {
        return this.spotify.api;
    }

    set api(val) {
    }

    get storage() {
        return this.spotify.storage;
    }

    set storage(val) {
    }
}