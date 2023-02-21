import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/track', (req, res) => {
            res.json({
                message: "track",
                data: {}
            });
        });

        this.router.get('/track/:id', (req, res) => {
            const trackId = req.params.id;

            res.json({
                message: "track",
                data: {
                    id: trackId
                }
            });
        });

        this.router.get('/track/play/:id', (req, res) => {
            const trackId = req.params.id;
            APP.SPOTIFY.player.play(trackId);
            res.json({
                message: "play track",
                data: {
                    id: trackId
                }
            });
        });

        return this.router;
    }
}
