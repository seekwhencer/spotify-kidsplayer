import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        /**
         * the active credentials
         */
        this.router.get('/auth', (req, res) => {
            const spotify = global.APP.SPOTIFY;

            if (spotify.auth.accessToken && spotify.auth.refreshToken) {
                res.json({
                    accessToken: spotify.auth.accessToken,
                    refreshToken: spotify.auth.refreshToken
                });
            } else {
                res.redirect('/auth/code/get');
            }
        });

        /**
         * trigger to get the code from spotify
         */
        this.router.get('/auth/code/get', (req, res) => {
            let url;
            const spotify = global.APP.SPOTIFY;

            spotify.resetSession();
            url = spotify.auth.createURL();

            res.redirect(url);
        });


        /**
         * receive the code from spotify
         */
        this.router.get('/auth/code', (req, res) => {
            const code = req.query.code;

            if (!code) {
                res.json({
                    message: 'nothing...'
                });
                return;
            }


            const spotify = global.APP.SPOTIFY;
            spotify.auth.code = code;

            if (!spotify.auth.accessToken) {
                spotify.auth
                    .grantCode()
                    .then(() => {
                        if (spotify.auth.accessToken && spotify.auth.refreshToken) {
                            return spotify.auth.auth();
                        }
                        return Promise.resolve(false);
                    })
                    .then(auth => {
                        auth ? spotify.auth.emit('auth') : null;
                        res.redirect('/auth');
                    })
                    .catch(e => {
                        ERROR(this.label, 'SOMETHING WENT ABSOLUTELY WRONG, DUDE...', e);
                    });
            } else {
                res.json({
                    code: code,
                    message: 'seems wrong'
                });
            }

        });

        return this.router;
    }
}
