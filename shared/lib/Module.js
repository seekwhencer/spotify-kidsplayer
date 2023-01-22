import Events from './Events.js';
import Crypto from 'crypto';
import {spawn} from 'child_process';

export default class Module extends Events {
    constructor(parent, options) {
        super();
        this.items = [];
        parent ? this.parent = parent : null;
        this.parent ? this.parent.app ? this.app = this.parent.app : null : null;
        this.id = this.createHash(`${Date.now()}`);
    }

    /**
     * get one, the first item by:
     *
     * @param match
     * @param field
     * @param not
     * @returns {*}
     */
    one(match, field, not) {
        return this.get(match, field, not)[0];
    }

    /**
     * get many items by:
     *
     * @param match
     * @param field
     * @param not
     * @returns {*[]}
     */
    many(match, field, not) {
        return this.get(match, field, not);
    }

    /**
     * get some items by:
     *
     * @param match
     * @param field
     * @param not
     * @returns {*[]}
     */
    get(match, field, not) {
        !field ? field = 'id' : null;
        return this.items.filter(item => {
            if (item['field'] === match) {
                return not !== item['field'];
            }
        });
    }

    /**
     *
     * @param bin
     * @param params
     * @returns {Promise<any>}
     */
    command(bin, params) {
        return new Promise((resolve, reject) => {
            LOG('MODULE COMMAND()', bin, JSON.stringify(params));
            let data = '';
            const process = spawn(bin, params);
            process.stdout.on('data', chunk => data += chunk);
            process.stdout.on('end', () => resolve(data));
        });
    }


    private(functionName, target, value) {
        if (value || this[functionName])
            PROP(target || this, functionName, {value: value || this[functionName]});
    }

    privates(functionNames, target) {
        functionNames.forEach(fn => this.private(fn, target));
    }

    registerOptionsAsFields(options) {
        Object.keys(options).forEach(k => {
            options[k] === '1' || options[k] === 'yes' || options[k] === 'true' ? options[k] = true : null;
            options[k] === '0' || options[k] === 'no' || options[k] === 'false' ? options[k] = false : null;
        });

        // convert the keys from uppercase with underscore between the words,
        // feed ist with keys like: "STREAM_URL" and convert ist to fields like: "streamUrl" (pascal case)
        Object.keys(options).forEach(k => {
            const pc = k.split('_').map((p, i) => i > 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p.toLowerCase()).join(''); // whooohaaaa
            this[pc] = options[k];
        });
    }

    createHash(seed) {
        return `${Crypto.createHash('md5').update(seed).digest("hex")}`;
    }
}
