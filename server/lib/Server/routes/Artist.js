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

            if(params.artistURI)
                APP.SPOTIFY.addArtist(params.artistURI);

            res.json({
                message: '',
                params: params
            });
        });

        this.router.post('/artist/update/:id', this.jsonParser);

        this.router.post('/artist/update', (req, res) => {
            res.json({
                message: ''
            });
        });

        this.router.get('/artist/delete/:id', (req, res) => {
            res.json({
                message: ''
            });
        });

        return this.router;
    }
}