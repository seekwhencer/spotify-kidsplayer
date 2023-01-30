export default class SpotifyController extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.spotify = parent;
        this.api = this.spotify.api;
        this.storage = parent.storage;
    }

    wrapIdFromURI(uri) {
        const splitA = uri.split('?');
        const splitB = splitA[0].split('/');
        return splitB[splitB.length - 1];
    }
}