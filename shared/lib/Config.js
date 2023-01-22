import Module from './Module.js';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

export default class Config extends Module {
    constructor() {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'CONFIG';
            this.configData = {};

            LOG(this.label, 'INIT');

            this.path = path.resolve(`${APP_DIR}/config`) || path.resolve(`${APP_DIR}/server/config`);
            this.typesFile = `${this.path}/types.json`;

            this.configFile = `${this.path}/${ENVIRONMENT}.conf`;
            this.envFile = `${path.resolve(`${APP_DIR}/..`)}/.env`;

            this.on('loaded', () => {
                LOG(this.label, 'LOADING COMPLETE', {verbose: 2});
            });

            this.load().then(success => resolve(this));
        });
    }

    load() {
        return this
            .loadAppConfig(this.configFile)
            .then(() => this.loadAppConfig(this.envFile, true))
            .then(() => {
                this.mergeOverrides();          // merge from environment variables
                this.expandArrays();            // make arrays from comma seperated lists
                this.convertTypes();            // convert boolean and integer values
                this.setConfigToGlobalScope();  // assign the config keys to the global scope
                this.postProcess();             // do things with the final config keys

                this.emit('loaded');

                return Promise.resolve(true);
            });
    }

    reload() {
        return this.load();
    }

    /**
     * load the config file
     * @returns {Promise<T>}
     */
    loadAppConfig(configFile, append) {
        //LOG(this.label, 'LOAD', configFile);
        !append ? append = false : null;

        return fs.readFile(configFile)
            .then(configData => {
                const config = dotenv.parse(configData);
                append === true ? this.configData = Object.assign(this.configData, config) : this.configData = config;
                LOG(this.label, 'LOADED', configFile, {verbose: 1});
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    /**
     * merge with environment variables
     */
    mergeOverrides() {
        Object.keys(this.configData).forEach(k => process.env[k] ? this.configData[k] = process.env[k] : false);
    }

    /**
     * expand comma separated values to an array
     */
    expandArrays() {
        const envKeys = Object.keys(this.configData);
        envKeys.forEach(k => {
            const split = this.configData[k].split(',');
            if (split.length > 1) {
                const arrayData = [];
                split.forEach(s => arrayData.push(s.trim()));
                this.configData[k] = arrayData;
            }
        });
    }

    convertTypes() {
        const types = fs.readJsonSync(this.typesFile);

        types.boolean.forEach(t => {
            if (Array.isArray(this.configData[t])) {
                const arr = [];

                this.configData[t].forEach(i => i.toLowerCase() === 'true' || i === '1' || i.toLowerCase() === 'yes' ? arr.push(true) : arr.push(false));
                this.configData[t] = arr;
            } else {
                this.configData[t].toLowerCase() === 'true' || this.configData[t] === '1' || this.configData[t].toLowerCase() === 'yes' ? this.configData[t] = true : this.configData[t] = false;
            }
        });

        types.int.forEach(t => {
            if (Array.isArray(this.configData[t])) {
                const arr = [];
                this.configData[t].forEach(i => arr.push(parseInt(i)));
                this.configData[t] = arr;
            } else {
                this.configData[t] = parseInt(this.configData[t]);
            }
        });
    }

    setConfigToGlobalScope() {
        //const globalKeys = Object.keys(global);
        //Object.keys(this.configData).forEach(k => globalKeys.includes(k.toUpperCase()) ? false : global[k.toUpperCase()] = this.configData[k.toUpperCase()]);

        // override props
        Object.keys(this.configData).forEach(k => global[k.toUpperCase()] = this.configData[k]);
    }

    postProcess() {
        LOG(this.label, 'VERBOSE LEVEL FROM CONFIG', VERBOSE);
    }

}
