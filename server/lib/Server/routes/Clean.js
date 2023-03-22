import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/clean', (req, res) => {
            const spotify = global.APP.SPOTIFY;

            spotify.storage.clean().then(clean => {
                res.json({
                    message: 'delete not associated data',
                    data: clean
                });
            });

        });

        return this.router;
    }
}
