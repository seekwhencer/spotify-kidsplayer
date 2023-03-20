import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/setup', (req, res) => {
            res.json({
                message: 'setup here',
                data: APP.SETUP.data,
                allowedProps: Object.keys(APP.CONFIG.data.configFile)
            });
        });

        this.router.post('/setup', this.jsonParser);
        this.router.post('/setup', (req, res) => {
            const params = req.body;

            // set the data proxy and write it down into the database
            Object.keys(params).forEach(prop => APP.SETUP.data[prop] = params[prop]);

            res.json({
                message: 'setup written',
                data: params
            });
        });

        return this.router;
    }
}
