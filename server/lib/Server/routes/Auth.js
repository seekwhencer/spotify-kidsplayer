import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        /**
         * the active credentials
         */
        this.router.get('/auth', (req, res) => {
            const spotify = global.APP.SPOTIFY;

            if (spotify.auth.session.accessToken && spotify.auth.session.refreshToken) {
                res.json({
                    accessToken: spotify.auth.session.accessToken,
                    refreshToken: spotify.auth.session.refreshToken
                });
            } else {
                res.redirect('/api/auth/code/get');
            }
        });

        this.router.get('/auth/reset', (req, res) => {
            const spotify = global.APP.SPOTIFY;
            spotify.resetSession();
            res.json({
                message: 'session reset'
            });
        });

        /**
         * trigger to get the code from spotify
         */
        this.router.get('/auth/code/get', (req, res) => {
            let url;
            const spotify = global.APP.SPOTIFY;
            url = spotify.auth.createURL();

            if (url) {
                res.redirect(url);
            } else {
                res.redirect('/api/auth');
            }
        });


        /**
         * receive the code from spotify
         */
        this.router.get('/auth/code', (req, res) => {
            const code = req.query.code;

            if (!code) {
                res.json({
                    message: 'got no code ...'
                });
                return;
            }

            const spotify = global.APP.SPOTIFY;

            if (!spotify.auth.session.accessToken) {
                spotify.auth.receiveCode(code).then(is_auth => {
                    is_auth ? res.redirect('/api/auth') : null;
                });
            } else {
                res.json({
                    code: code,
                    message: 'seems a wrong'
                });
            }
        });

        return this.router;
    }
}
