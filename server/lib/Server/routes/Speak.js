import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.post('/speak', this.jsonParser);
        this.router.post('/speak', (req, res) => {
            const params = req.body;
            APP.TTS.speak(params.text).then(hash => res.redirect(`/speak/${hash}.mp3`));
        });

        return this.router;
    }
}
