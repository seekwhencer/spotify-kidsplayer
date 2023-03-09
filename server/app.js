import './lib/Globals.js';
import Config from '../shared/lib/Config.js';
import Setup from './lib/Setup/index.js';

import WebServer from './lib/Server/index.js';
import Mqtt from './lib/Mqtt/index.js';
import Spotify from './lib/Spotify/index.js';
import TTS from './lib/TextToSpeech/index.js';

export default class App extends MODULECLASS {
    constructor() {
        super();

        global.APP = this;

        return new Config(this)
            .then(config => {
                global.APP.CONFIG = config;
                //global.CONF = config;
                //global.CONFIG = config.configData;
                return new Setup(this);
            })
            .then(setup => {
                global.APP.SETUP = setup;
                return new WebServer(this);
            })
            .then(webserver => {
                global.APP.WEBSERVER = webserver;
                return new Mqtt(this);
            })
            .then(mqtt => {
                global.APP.MQTT = mqtt;
                return new TTS(this);
            })
            .then(tts => {
                global.APP.TTS = tts;
                return new Spotify(this);
            })
            .then(spotify => {
                global.APP.SPOTIFY = spotify;
                return Promise.resolve(this);
            });
    }
}