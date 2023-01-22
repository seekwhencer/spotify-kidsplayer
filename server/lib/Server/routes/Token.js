import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/token', (req, res) => {
            const code = req.query.code;

            res.json({
                code: code
            });
        });

        return this.router;
    }
}
