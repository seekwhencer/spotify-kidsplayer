import Route from '../Route.js';

export default class extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.router.get('/code', (req, res) => {
            const spotify = global.APP.SPOTIFY;
            spotify.auth.session.code = req.query.code;
            spotify.auth
                .grantCode()
                .then(() => {
                    if (spotify.auth.session.accessToken && spotify.auth.session.refreshToken) {
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
