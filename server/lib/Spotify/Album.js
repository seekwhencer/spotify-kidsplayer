export default class SpotifyAlbum extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ALBUM';
        LOG(this.label, 'INIT');
        this.spotify = parent;
        this.api = parent.api;
    }

    getArtistAlbums(id) {
        /*const options = {
            limit: 10,
            offset: 20
        };*/

        const options = {}

        return this.api
            .getArtistAlbums(id, options)
            .then(data => {
                //..
                return Promise.resolve(data.body);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }
}