import {writeFile} from 'node:fs';
import {spawn} from 'child_process';

export default class Spotifyd extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        return new Promise((resolve, reject) => {
            this.label = 'SPOTIFY DAEMON';
            LOG(this.label, 'INIT');

            this.setup = APP.SETUP;
            this.types = APP.CONFIG.types;

            this.filePath = `/kidsplayer/spotifyd/spotifyd.conf`;

            /**
             *  the config object
             *  ignoring global config
             */
            this.configMap = {
                username: 'SPOTIFYD_USERNAME',
                password: 'SPOTIFYD_PASSWORD',
                backend: 'SPOTIFYD_BACKEND',
                device: 'SPOTIFYD_DEVICE',
                mixer: 'SPOTIFYD_MIXER',
                volume_control: 'SPOTIFYD_VOLUME_CONTROL',
                device_name: 'SPOTIFYD_DEVICE_NAME',
                bitrate: 'SPOTIFYD_BITRATE',
                cache_path: 'SPOTIFYD_CACHE_PATH',
                volume_normalisation: 'SPOTIFYD_VOLUME_NORMALISATION',
                normalisation_pregain: 'SPOTIFYD_NORMALISATION_PREGAIN'
            };

            // the delegation object
            this.config = new Proxy({}, {
                get: (target, prop, receiver) => this.setup.data[this.configMap[prop]],
                set: (target, prop, value) => {
                    this.setup.data[this.configMap[prop]] = value;
                    return true;
                }
            });

            resolve(this);
        });
    }

    writeConfig() {
        let configFile = "[global]\n";
        Object.keys(this.configMap).forEach(prop => {
            const type = this.types[this.configMap[prop]];
            if (!type)
                configFile += `${prop} = "${this.config[prop]}"` + "\n";

            if (type === 'int' || type === 'boolean')
                configFile += `${prop} = ${this.config[prop]}` + "\n";
        });

        return writeFile(this.filePath, configFile, err => {
            if (err) throw err;
            LOG(this.label, 'CONFIG HAS BEEN SAVED');
            this.restart();
        });
    }

    restart() {
        return new Promise((resolve, reject) => {
            const params = ['restart', 'kidsplayer_spotifyd'];
            LOG(this.label, 'COMMAND', '/usr/bin/docker', JSON.stringify(params));

            let data = '';
            const process = spawn('/usr/bin/docker', params);
            process.stdout.on('data', chunk => data += chunk);
            process.stdout.on('end', () => resolve(data));
        }).then(data => {
            LOG(this.label, 'RESTARTED', data);
            return Promise.resolve(true);
        });
    }

}
