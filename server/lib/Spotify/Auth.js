import fs from 'fs-extra';

/**
 * Steps:
 *
 * 1) Run the app the first time
 * 2) open the displayed url in your browser
 * 3) copy the "code" from the get parameter from the received redirect page
 * 4) create a file: "server/config/.code" and paste the code in it
 * 5) restart the app
 *
 */

export default class SpotifyAuth extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY AUTH';
            LOG(this.label, 'INIT');

            this.api = this.parent.api;
            this.clientId = this.parent.clientId;
            this.clientSecret = this.parent.clientSecret;
            this.redirectUri = this.parent.redirectUri;

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

            this.fileNames = {
                code: `${APP_DIR}/config/.code`,
                accessToken: `${APP_DIR}/config/.access_token`,
                refreshToken: `${APP_DIR}/config/.refresh_token`,
                expireToken: `${APP_DIR}/config/.expire_token`
            }

            /**
             * Events
             */
            this.on('auth', () => {
                LOG(this.label, 'AUTH CHECK OK.');
                this.parent.emit('auth');
                this.startRefreshCycle();
            });


            /**
             * Start here
             */
            this
                .readFiles()
                .then(() => {

                    LOG('---');
                    LOG(this.label, 'CODE:', this.code);
                    LOG(this.label, 'ACCESS TOKEN:', this.accessToken);
                    LOG(this.label, 'REFRESH TOKEN:', this.refreshToken);
                    LOG('---');

                    if (!this.code) {
                        return this.getCode();
                    }
                    if (!this.accessToken && this.code) {
                        return this.grantCode();
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    if (this.accessToken && this.refreshToken) {
                        return this.auth();
                    }
                    return Promise.resolve(false);
                })
                .then(auth => {
                    auth ? this.emit('auth') : null;
                    resolve(this);
                })
                .catch(e => {
                    ERROR(this.label, 'SOMETHING WENT ABSOLUTELY WRONG, DUDE...', e);
                });


        });
    }

    getCode() {
        if (this.code)
            return Promise.reject(false);

        this.authorizeURL = this.api.createAuthorizeURL(this.scopes, this.state);
        console.log('');
        console.log('');
        console.log(this.authorizeURL);
        console.log('');
        console.log('');
        LOG('---');
        LOG(this.label, '-', 'NOW - copy the url per hand or click on it to open the spotify authentication');
        LOG(this.label, '-', 'LOG IN your spotify account and agree to the app.');
        LOG(this.label, '-', 'THEN you will be redirected to your entered redirect page');
        LOG(this.label, '-', 'COPY BY HAND the get parameter value from variable "code"');
        LOG(this.label, '-', 'PASTE the code into the file: server/config/.code');
        LOG(this.label, '-', 'RESTART this app');
        LOG('---');

        return Promise.resolve(this.authorizeURL);
    }

    createURL() {
        if (this.code)
            return;

        return this.authorizeURL = this.api.createAuthorizeURL(this.scopes, this.state);
    }

    startRefreshCycle() {
        const ms = this.expireToken / 2 * 1000;
        LOG(this.label, 'STARTING ACCESS TOKEN REFRESH CYCLE IN', ms / 1000, 'SECONDS');
        if (this.refreshCycle)
            clearInterval(this.refreshCycle);

        this.refreshCycle = setInterval(() => this.refreshAccessToken(), ms);
    }

    grantCode() {
        if (!this.code)
            return;

        return this.api.authorizationCodeGrant(this.code).then((data, err) => {

            if (err) {
                ERROR(this.label, err);
                return Promise.reject(false);
            }

            this.accessToken = data.body.access_token;
            this.refreshToken = data.body.refresh_token;
            this.expireToken = parseInt(data.body.expires_in);

            LOG(this.label, 'The access token is', this.accessToken);
            LOG(this.label, 'The refresh token is', this.refreshToken);
            LOG(this.label, 'The token expires in', this.expireToken, this.expireToken / 2 * 1000);

            // Set the access token on the API object to use it in later calls
            return Promise.resolve();
        });
    }

    auth() {
        this.api.setAccessToken(this.accessToken);
        this.api.setRefreshToken(this.refreshToken);

        return Promise.all([
            this.writeFile(this.fileNames.accessToken, this.accessToken),
            this.writeFile(this.fileNames.refreshToken, this.refreshToken),
            this.writeFile(this.fileNames.expireToken, this.expireToken.toString())
        ]);
    }

    refreshAccessToken() {
        return this.api.refreshAccessToken().then((data, err) => {
            if (err) {
                ERROR(this.label, err);
                return Promise.reject(false);
            }

            this.accessToken = data.body.access_token;
            this.api.setAccessToken(this.accessToken);
            this.writeFile(this.fileNames.accessToken, this.accessToken);

            LOG(this.label, 'REFRESHING ACCESS TOKEN', this.accessToken);
            return Promise.resolve();
        })
    }

    writeFile(fileName, data) {
        return fs.writeFile(fileName, data).catch(e => {
            LOG(this.label, 'FILE NOT WRITTEN', fileName);
        });
    }

    readFile(fileName) {
        return fs.readFile(fileName).catch(e => {
            LOG(this.label, 'FILE NOT EXISTS:', fileName);
        });
    }

    readCode() {
        return this.readFile(this.fileNames.code).then(code => code ? this.code = code.toString() : null);
    }

    readToken() {
        return Promise.all([
            this.readFile(this.fileNames.accessToken).then(accessToken => accessToken ? this.accessToken = accessToken.toString() : null),
            this.readFile(this.fileNames.refreshToken).then(refreshToken => refreshToken ? this.refreshToken = refreshToken.toString() : null)]
        );
    }

    readExpire() {
        return this.readFile(this.fileNames.expireToken).then(expireToken => expireToken ? this.expireToken = parseInt(expireToken) : null);
    }

    readFiles() {
        return Promise
            .all([
                this.readCode(),
                this.readToken(),
                this.readExpire()
            ]);
    }

    reset() {
        LOG(this.label, 'RESET SESSION');
        this.code = false;
        this.accessToken = false;
        this.refreshToken = false;
        this.expireToken = false;
    }

    get code() {
        return this._code;
    }

    set code(val) {
        this.writeFile(this.fileNames.code, val === false ? '' : val);
        this._code = val;
    }

    get accessToken() {
        return this._accessToken;
    }

    set accessToken(val) {
        this.writeFile(this.fileNames.accessToken, val === false ? '' : val);
        this._accessToken = val;
    }

    get refreshToken() {
        return this._refreshToken;
    }

    set refreshToken(val) {
        this.writeFile(this.fileNames.refreshToken, val === false ? '' : val);
        this._refreshToken = val;
    }

    get expireToken() {
        return this._expireToken;
    }

    set expireToken(val) {
        this.writeFile(this.fileNames.expireToken, val === false ? '' : val.toString());
        this._expireToken = val;
    }
}