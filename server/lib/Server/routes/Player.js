import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/player', (req, res) => {
            res.json({
                message: "track",
                data: {}
            });
        });

        this.router.get('/player/play/track/:id', (req, res) => {
            const trackId = req.params.id;
            APP.SPOTIFY.player.play(trackId);
            res.json({
                message: "play track",
                data: {
                    id: trackId
                }
            });
        });

        this.router.get('/player/stop', (req, res) => {
            APP.SPOTIFY.player.stop();
            res.json({
                message: "stop track",
                data: {}
            });
        });

        this.router.get('/player/pause', (req, res) => {
            APP.SPOTIFY.player.pause();
            res.json({
                message: "pause track",
                data: {}
            });
        });

        this.router.get('/player/resume', (req, res) => {
            APP.SPOTIFY.player.resume();
            res.json({
                message: "resume track",
                data: {}
            });
        });

        return this.router;
    }
}
