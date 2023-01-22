export default class Route extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.router = EXPRESS.Router();

    }

    nicePath(path) {
        return decodeURI(path).replace(/^\//, '').replace(/\/$/, '');
    }

    extractPath(path, subtract) {
        return this.nicePath(path).replace(new RegExp(`${subtract}`, ''), '').split('/');
    }
}
