export default class SpotifyArtist extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ARTIST';
        LOG(this.label, 'INIT');
        this.spotify = parent;
        this.api = parent.api;
    }

    getById(spotifyId) {
        return this.api
            .getArtist(spotifyId)
            .then(data => {
                //..
                return Promise.resolve(data.body);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }
}