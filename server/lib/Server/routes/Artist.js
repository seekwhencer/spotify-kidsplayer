import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/artists', (req, res) => {
            APP.SPOTIFY.getArtists().then(artists => {
                res.json({
                    message: 'all artists',
                    data: artists
                });
            });

        });

        this.router.get('/artist/:id', (req, res) => {
            const artistId = req.params.id;
            APP.SPOTIFY.getArtist(artistId).then(artist => {
                res.json({
                    message: 'one artists',
                    data: artist
                });
            });
        });

        this.router.post('/artist/:id/albums/filter', this.jsonParser);
        this.router.post('/artist/:id/albums/filter', (req, res) => {
            const artistId = req.params.id;
            const params = req.body;

            APP.SPOTIFY.saveArtistAlbumsFilter(artistId, params).then(data => {
                res.json({
                    message: 'albums filter',
                    data: data,
                    filter: params
                });
            });
        });

        this.router.post('/artist/add', this.jsonParser);
        this.router.post('/artist/add', (req, res) => {
            const params = req.body;

            if (params.artistURI)
                APP.SPOTIFY.addArtist(params.artistURI).then(data => {
                    if (data) {
                        res.json({
                            data: data,
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


        this.router.get('/artist/:id/toggle-visibility', (req, res) => {
            const artistId = req.params.id;

            APP.SPOTIFY.toggleArtistHidden(artistId).then(artist => {
                res.json({
                    message: 'one artist',
                    data: artist
                });
            });
        });


        this.router.post('/artist/:id/posterimage', this.jsonParser);
        this.router.post('/artist/:id/posterimage', (req, res) => {
            const artistId = req.params.id;
            const params = req.body;

            APP.SPOTIFY.setArtistPosterImage(artistId, params).then(artist => {
                res.json({
                    message: 'set poster image for artist',
                    data: artist
                });
            });
        });

        this.router.post('/artist/:id/image/add', this.jsonParser);
        this.router.post('/artist/:id/image/add', (req, res) => {
            const artistId = req.params.id;
            const params = req.body;

            APP.SPOTIFY.addArtistImage(artistId, params).then(artist => {
                res.json({
                    message: 'add image for artist',
                    data: artist
                });
            });
        });

        return this.router;
    }
}