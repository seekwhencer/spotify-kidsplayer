import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/setup', (req, res) => {
            res.json({
                message: 'setup here',
                data: APP.SETUP.data
            });
        });

        this.router.post('/setup', this.jsonParser);
        this.router.post('/setup', (req, res) => {
            const params = req.body;
            res.json({
                message: 'setup here',
                data: params
            });
        });

        return this.router;
    }
}
