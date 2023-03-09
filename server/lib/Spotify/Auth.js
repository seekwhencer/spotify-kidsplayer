import followRedirects from 'follow-redirects';

const http = followRedirects.http;
const https = followRedirects.https;

export default class SpotifyAuth extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY AUTH';
            LOG(this.label, 'INIT');

            this.api = this.parent.api;
            this.setup = this.parent.setup;

            this.clientId = this.parent.config.clientId;
            this.clientSecret = this.parent.config.clientSecret;
            this.redirectUri = this.parent.config.redirectUri;

            /**
             *  the session object
             */
            this.sessionMap = {
                accessToken: 'SPOTIFY_ACCESS_TOKEN',
                refreshToken: 'SPOTIFY_REFRESH_TOKEN',
                expireToken: 'SPOTIFY_TOKEN_EXPIRE',
                code: 'SPOTIFY_CODE',
                scopes: 'SPOTIFY_SCOPES',
                state: 'SPOTIFY_STATE',
                authorizeURL: 'SPOTIFY_AUTHORIZE_URL'
            };
            this.session = new Proxy({}, {
                get: (target, prop, receiver) => this.setup.data[this.sessionMap[prop]],
                set: (target, prop, value) => {
                    this.setup.data[this.sessionMap[prop]] = value;
                    return true;
                }
            });

            /**
             * Events
             */
            this.on('auth', () => {
                LOG(this.label, 'AUTH CHECK OK.');
                this.parent.emit('auth');
                this.refreshAccessToken();
                this.startRefreshCycle();
            });

            this.on('session-expired', () => {
                LOG(this.label, 'ACCESS TOKEN EXPIRED');
                this.reset();
           });


            // setup
            this.scopes = [
                'user-read-playback-state',
                'user-read-currently-playing',
                'streaming',
                'app-remote-control',
                'user-read-private',
                'user-read-email',
                'playlist-read-collaborative',
                'playlist-read-private',
                'user-library-read',
                'user-top-read',
                'user-read-playback-position',
                'user-read-recently-played',
                'user-follow-read'
            ];
            this.state = 'play';

            if (!this.session.accessToken || !this.session.refreshToken) {
                this.emit('session-expired');
            }

            if (this.session.accessToken && this.session.refreshToken) {
                this.auth()
                    .then(auth => auth ? this.emit('auth') : null)
                    .catch(e => ERROR(this.label, 'SOMETHING WENT ABSOLUTELY WRONG, DUDE...', e));
            }

            resolve(this);
        });
    }


    auth() {
        LOG(this.label, 'SET & REFRESH AUTH TOKEN', this.session.accessToken, this.session.refreshToken);
        this.api.setAccessToken(this.session.accessToken);
        return this.refreshAccessToken();
    }
    createURL() {
        if (this.session.code)
            return;

        LOG(this.label, 'CREATE CODE URL', this.redirectUri);
        this.api.setRedirectURI(this.redirectUri);
        return this.session.authorizeURL = this.api.createAuthorizeURL(this.scopes, this.state);
    }

    startRefreshCycle() {
        const ms = this.session.expireToken / 2 * 1000;
        LOG(this.label, 'STARTING ACCESS TOKEN REFRESH CYCLE IN', ms / 1000, 'SECONDS');
        if (this.refreshCycle)
            clearInterval(this.refreshCycle);

        this.refreshCycle = setInterval(() => this.refreshAccessToken(), ms);
    }

    grantCode() {
        if (!this.session.code)
            return Promise.resolve(false);

        return this.api.authorizationCodeGrant(this.session.code).then((data, err) => {

            if (err) {
                ERROR(this.label, err);
                return Promise.reject(false);
            }

            this.session.accessToken = data.body.access_token;
            this.session.refreshToken = data.body.refresh_token;
            this.session.expireToken = parseInt(data.body.expires_in);

            LOG(this.label, 'NEW ACCESS TOKEN:', this.session.accessToken);
            LOG(this.label, 'NEW REFRESH TOKEN', this.session.refreshToken);
            LOG(this.label, 'NEW EXPIRE TIME', this.session.expireToken, this.session.expireToken / 2 * 1000);

            // Set the access token on the API object to use it in later calls
            return Promise.resolve(true);
        });
    }


    refreshAccessToken() {
        this.api.setRefreshToken(this.session.refreshToken);

        return this.api.refreshAccessToken().then((data, err) => {
            if (err) {
                ERROR(this.label, err);
                return Promise.reject(false);
            }

            if (!data.body.access_token) {
                ERROR(this.label, 'WRONG RESPONSE', data.body, '');
                return Promise.reject(false);
            }

            this.session.accessToken = data.body.access_token;
            this.session.expireToken = parseInt(data.body.expires_in);

            this.api.setAccessToken(this.session.accessToken);
            this.api.setRefreshToken(this.session.refreshToken);

            LOG(this.label, 'REFRESHING ACCESS TOKEN', this.session.accessToken);
            return Promise.resolve(true);
        })
    }

    reset() {
        LOG(this.label, 'RESET SESSION');

        this.session.code = false;
        this.session.accessToken = false;
        this.session.refreshToken = false;
        this.session.expireToken = false;

        this.api.resetAccessToken();
        this.api.resetRefreshToken();
        this.api.resetRedirectURI();
        //this.api.resetCode();
    }
}