import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/artist/:id', (req, res) => {
            res.json({
                message: ''
            });
        });

        this.router.post('/artist/add', this.jsonParser);
        this.router.post('/artist/add', (req, res) => {
            const params = req.body;

            if (params.artistURI)
                APP.SPOTIFY.addArtist(params.artistURI).then(artistId => {
                    if (artistId) {
                        res.json({
                            artistId: artistId,
                            params: params
                        });
                    } else {
                        res.json({
                            message: 'artist exists',
                            params: params
                        });
                    }
                }).catch(e => {
                    res.json({
                        message: 'error',
                        params: params,
                        error: e
                    });
                });
        });

        this.router.post('/artist/update/:id', this.jsonParser);
        this.router.post('/artist/update/:id', (req, res) => {
            const params = req.body;
            const artistId = req.params.id;

            APP.SPOTIFY.updateArtist(artistId, params).then(artist => {
                if (artist) {
                    res.json({
                        message: 'artist updated',
                        artist: artist,
                        params: params
                    });
                } else {
                    res.json({
                        message: 'not exists',
                        params: params
                    });
                }
            });
        });

        this.router.post('/artist/reset/:id', (req, res) => {

        });

        this.router.get('/artist/delete/:id', (req, res) => {
            res.json({
                message: ''
            });
        });

        /**
         * Albums
         */
        this.router.get('/artist/albums/:id', this.jsonParser);
        this.router.get('/artist/albums/:id', (req, res) => {
            const params = req.body;
            const artistId = req.params.id;

            if (params.artistURI)
                APP.SPOTIFY.getArtistAlbums(params.artistURI).then(albums => {
                    if (albums) {
                        res.json({
                            artistId: albums,
                            params: params
                        });
                    } else {
                        res.json({
                            message: 'artist exists',
                            params: params
                        });
                    }
                });

            res.json({
                message: ''
            });
        });



        return this.router;
    }
}