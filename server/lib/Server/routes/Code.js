import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/code', (req, res) => {
            const spotify = global.APP.SPOTIFY;
            spotify.auth.code = req.query.code;
            spotify.auth
                .grantCode()
                .then(() => {
                    if (spotify.auth.accessToken && spotify.auth.refreshToken) {
                        return spotify.auth.auth();
                    }
                    return Promise.resolve(false);
                })
                .then(auth => auth ? spotify.auth.emit('auth') : null);
        });

        this.router.get('/code/request', (req, res) => {
            global.APP.SPOTIFY.auth
                .getCode()
                .then(authorizeURL => res.redirect(authorizeURL));
        });

        return this.router;
    }
}
