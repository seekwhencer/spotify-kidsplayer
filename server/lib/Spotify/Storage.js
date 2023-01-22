export default class SpotifyStorage extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY STORAGE';
            LOG(this.label, 'INIT');
        });
    }
}