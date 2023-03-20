import http from 'http';
import fs from 'fs';
import TTSClass from './Class.js';

export default class Mimic extends TTSClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'MIMIC';
        LOG(this.label, 'INIT');

        this.host = TTS_MIMIC_HOST;
        this.port = TTS_MIMIC_PORT;
        this.voice = 'de_DE/m-ailabs_low#ramona_deininger';
        this.noiseScale = '0.333';
        this.noiseW = '0.333';
        this.lengthScale = '1.5';
        this.audioTarget = 'client';
    }

    speak(text) {
        const options = {
            text: text,
            voice: this.voice,
            noiseScale: this.noiseScale,
            noiseW: this.noiseW,
            lengthScale: this.lengthScale,
            audioTarget: this.audioTarget,
            ssml: 'false'
        };

        const hash = this.createHash(JSON.stringify(options));

        return this.exists(hash)
            .then(() => Promise.resolve(hash))              // exists
            .catch(e => this.getAudio(options, hash));      // not exists
    }

    getAudio(mimicOptions, hash) {
        return new Promise((resolve, reject) => {

            const filePath = `${this.storagePath}/${hash}.wav`;
            const sendDataString = Object.keys(mimicOptions).map(i => `${i}=${encodeURI(mimicOptions[i])}`).join('&');

            LOG(this.label, 'SEND DATA', sendDataString);

            const requestOptions = {
                hostname: `${this.host}`,
                port: this.port,
                path: `/api/tts?${sendDataString}`,
            };

            const req = http.get(requestOptions, res => {
                const writeStream = fs.createWriteStream(`${filePath}`);
                res.pipe(writeStream);

                writeStream.on('error', () => reject('Error writing to file!'));
                writeStream.on('finish', () => {
                    writeStream.close(resolve);
                    LOG(this.label, 'AUDIO WRITTEN', hash);
                    resolve(hash);
                });
            });

            req.on('error', (e) => ERROR(this.label, ':', e.message));

        });
    }
}