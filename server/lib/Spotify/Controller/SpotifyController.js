import https from 'https';

export default class SpotifyController extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.spotify = parent;

        this.apiHost = 'api.spotify.com';
        this.apiBasePath = '/v1';
    }

    wrapIdFromURI(uri) {
        const splitA = uri.split('?');
        const splitB = splitA[0].split('/');
        return splitB[splitB.length - 1];
    }

    request(requestData, method, requestPath) {
        !method ? method = 'GET' : null;

        let data = '';
        let bodyString = false;

        return new Promise((resolve, reject) => {

            if (requestData !== false)
                bodyString = JSON.stringify(requestData);

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.spotify.auth.accessToken}`
            };

            if (bodyString !== false) {
                headers['Accept'] = 'application/json';
                headers['Content-Length'] = Buffer.byteLength(bodyString);
            }

            const requestOptions = {
                headers: headers,
                hostname: this.apiHost,
                path: `${this.apiBasePath}/${requestPath}`,
                method: method
            };

            const req = https.request(requestOptions, res => {
                res.on('data', responseData => data = `${data}${responseData}`);
                res.on('end', () => resolve(data));
            });

            req.on('error', (e) => {
                ERROR(this.label, ':', e.message);
                reject();
            });

            if (bodyString !== false) {
                req.write(bodyString);
            }

            req.end();

        });
    }

    get api() {
        return this.spotify.api;
    }

    set api(val) {
    }

    get storage() {
        return this.spotify.storage;
    }

    set storage(val) {
    }
}