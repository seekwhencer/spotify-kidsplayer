export default class SpotifyArtist extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY ARTIST';
            LOG(this.label, 'INIT');
        });
    }
}