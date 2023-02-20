import http from 'http';
import fs from 'fs';
import TTSClass from './Class.js';

export default class TTSF extends TTSClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'TTSF';
        LOG(this.label, 'INIT');

    }

    speak(text) {
        const serviceOptions = {

        };

        const hash = this.createHash(JSON.stringify(serviceOptions));

        return this.exists(hash)
            .then(() => Promise.resolve(hash))              // exists
            .catch(e => this.getAudio(serviceOptions, hash));      // not exists
    }

    getAudio(serviceOptions, hash) {
        return new Promise((resolve, reject) => {
            resolve(hash);
        });
    }
}