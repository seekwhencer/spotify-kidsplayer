import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/albums', (req, res) => {
            APP.SPOTIFY.getAlbums().then(albums => {
                res.json({
                    message: 'all albums',
                    data: albums
                });
            });

        });

        this.router.get('/album/:id', (req, res) => {
            const albumId = req.params.id;
            APP.SPOTIFY.getAlbum(albumId).then(album => {
                res.json({
                    message: 'one albums',
                    data: album
                });
            });
        });

        this.router.get('/album/:id/type/:type', (req, res) => {
            const albumId = req.params.id;
            const type = req.params.type;

            APP.SPOTIFY.setAlbumType(albumId, type).then(album => {
                res.json({
                    message: 'one albums',
                    data: album
                });
            });
        });

        this.router.get('/album/:id/toggle-visibility', (req, res) => {
            const albumId = req.params.id;

            APP.SPOTIFY.toggleAlbumHidden(albumId).then(album => {
                res.json({
                    message: 'one albums',
                    data: album
                });
            });
        });

        this.router.get('/album/:id/toggle-liked', (req, res) => {
            const albumId = req.params.id;

            APP.SPOTIFY.toggleAlbumLiked(albumId).then(album => {
                res.json({
                    message: 'one albums',
                    data: album
                });
            });
        });

        this.router.post('/album/add', this.jsonParser);
        this.router.post('/album/add', (req, res) => {
            const params = req.body;

            if (params.albumURI)
                APP.SPOTIFY.addAlbum(params.albumURI).then(data => {
                    if (data) {
                        res.json({
                            data: data,
                            params: params
                        });
                    } else {
                        res.json({
                            message: 'album exists',
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

        this.router.post('/album/update/:id', this.jsonParser);
        this.router.post('/album/update/:id', (req, res) => {
            const params = req.body;
            const albumId = req.params.id;

            APP.SPOTIFY.updateAlbum(albumId, params).then(album => {
                if (album) {
                    res.json({
                        message: 'album updated',
                        album: album,
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

        this.router.post('/album/reset/:id', (req, res) => {

        });

        this.router.get('/album/delete/:id', (req, res) => {
            res.json({
                message: ''
            });
        });

        /**
         * Albums
         */
        this.router.get('/album/albums/:id', this.jsonParser);
        this.router.get('/album/albums/:id', (req, res) => {
            const params = req.body;
            const albumId = req.params.id;

            if (params.albumURI)
                APP.SPOTIFY.getAlbumAlbums(params.albumURI).then(albums => {
                    if (albums) {
                        res.json({
                            albumId: albums,
                            params: params
                        });
                    } else {
                        res.json({
                            message: 'album exists',
                            params: params
                        });
                    }
                });

            res.json({
                message: ''
            });
        });

        this.router.post('/album/:id/image/add', this.jsonParser);
        this.router.post('/album/:id/image/add', (req, res) => {
            const albumId = req.params.id;
            const params = req.body;

            APP.SPOTIFY.addAlbumImage(albumId, params).then(album => {
                res.json({
                    message: 'add image for album',
                    data: album
                });
            });
        });


        return this.router;
    }
}