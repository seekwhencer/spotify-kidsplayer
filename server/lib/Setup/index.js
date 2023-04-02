import SetupModel from './Model.js';

export default class Setup extends SetupModel {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'SETUP';
            LOG(this.label, 'INIT');

            this.table = 'setup';
            this.types = APP.CONFIG.types;

            this.registerPropEvents();

            /**
             * if this.data.PROPERTY will be set, update setup DB automatically
             */
            this.dataSource = {};
            this.data = new Proxy(this.dataSource, {
                get: (target, prop, receiver) => {
                    return this.convertTypeRead(target[prop], prop);
                },
                set: (target, prop, value) => {
                    const valueWrite = this.convertTypeWrite(value, prop);

                    // store the db converted value
                    target[prop] = valueWrite;

                    // emit prop event
                    this.emit(prop, value);

                    // emit prop group event
                    this.emit(prop.split('_')[0], prop, value);

                    // override global config vars
                    global[prop] = this.convertTypeRead(target[prop], prop);

                    return this
                        .getProperty(prop)
                        .then(exists => {
                            if (!exists) {
                                return this.create({
                                    property: prop,
                                    value: valueWrite
                                }).then(() => true);
                            } else {
                                if (value !== exists)
                                    return this.updateProperty(prop, valueWrite).then(() => true);

                                return true;
                            }
                        });
                }
            });

            this.getAll().then(() => {
                this.feedFromConfig();
                resolve(this);
            });
        });
    }

    registerPropEvents() {
        // testing
        this.on('UI_LOCALE', () => APP.SPOTIFY.recreateApi());

        this.on('SPOTIFY_ID', () => APP.SPOTIFY.recreateApi());
        this.on('SPOTIFY_SECRET', () => APP.SPOTIFY.recreateApi());
        this.on('SPOTIFY_REDIRECT_URI', () => APP.SPOTIFY.recreateApi());

        this.on('SPOTIFYD', (prop, value) => APP.SPOTIFYD.writeConfig());
    }

    feedFromConfig() {
        APP.CONFIG.properties.forEach(prop => {
            if (!this.dataSource[prop])
                this.data[prop] = APP.CONFIG.configData[prop];
        });
    }

    convertTypeRead(value, property) {
        if (value === undefined)
            return;

        const type = this.types[property];

        if (value.toLowerCase) {
            if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
                return true;
            }
            if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
                return false;
            }
        }

        if (type === 'boolean') {
            if (value === '1') {
                return true;
            }
            if (value === '0') {
                return false;
            }
        }

        if (type === 'int')
            return parseInt(value);

        return value;
    }

    convertTypeWrite(value, property) {
        const type = this.types[property];

        if (type === 'boolean') {
            if (value === true || value === 'true') {
                return '1';
            }
            if (value === false || value === 'false') {
                return '0';
            }
        }

        if (type === 'int')
            return value.toString();

        return value;
    }

    //-----------------------------

    getAll() {
        return super.getAll()
            .then(raw => {
                raw.forEach(prop => this.dataSource[prop.property] = prop.value);
                return Promise.resolve();
            });
    }
}