export default class SpotifyArtists extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY ARTISTS';
            LOG(this.label, 'INIT');
        });
    }
}