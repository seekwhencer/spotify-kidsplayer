import dateFormat from 'dateformat';
import Module from './Module.js';

export default class Log extends Module {
    constructor(args) {
        super(args);
        this.label = 'LOGGER';

        this.log(this.label, 'VERBOSE LEVEL FROM ENVIRONMENT', `${global.VERBOSE ? global.VERBOSE : 'NOT SET'}`);
    }

    log() {
        if (global.DEBUG === false) {
            return false;
        }
        let options = {};
        let params = Array.from(arguments);
        let output = [`[${dateFormat(new Date(), "H:MM:ss - d.m.yyyy")}] `];

        if (typeof params[params.length - 1] === 'object') {
            options = params[params.length - 1];
            params = params.slice(0, -1); // cut the last element as options object
        }

        if (!options.verbose) {
            options.verbose = VERBOSE;
        }

        if (options.verbose > VERBOSE)
           return;

        output = output.concat(params);
        console.log.apply(console, output);
    }

    error() {
        if (global.DEBUG === false) {
            return false;
        }
        let output = [
            '[!!! ',
            dateFormat(new Date(), "H:MM:ss - d.m.yyyy"),
            '!!!]'
        ].concat(Array.from(arguments));
        console.error.apply(console, output);
    }
}

