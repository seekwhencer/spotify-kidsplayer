import AppSetupModel from './Model.js';

export default class AppSetup extends AppSetupModel {
    constructor(parent, options) {
        super(parent, options);
        return new Promise((resolve, reject) => {
            this.label = 'SETUP';
            LOG(this.label, 'INIT');

            this.table = 'setup';

            this.flattenTypes();

            /**
             * if this.data.PROPERTY will be set, update setup DB automatically
             */
            this.dataSource = {};
            this.data = new Proxy(this.dataSource , {
                get: (target, prop, receiver) => {
                    return target[prop];
                },
                set: (target, prop, value) => {
                    target[prop] = this.convertTypeRead(value, prop);
                    const valueWrite = this.convertTypeWrite(target[prop], prop);

                    //LOG(this.label, 'SET',  target[prop]);

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
                // testing
                //this.data.MQTT_PORT = 1886;

                resolve(this);
            });
        });

    }

    flattenTypes() {
        this.types = {};
        Object.keys(APP.CONFIG.types).forEach(type => {
            APP.CONFIG.types[type].forEach(prop => {
                this.types[prop] = type;
            });
        });
    }

    convertTypeRead(value, property) {
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
//                this.dataSource = raw;
                raw.forEach(prop => this.dataSource[prop.property] = prop.value);
                return Promise.resolve();
            });
    }
}