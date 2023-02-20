import http from 'http';
import fs from 'fs';

export default class Mimic extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'MIMIC';
            LOG(this.label, 'INIT');

            this.storagePath = `${STORAGE_CONTAINER_PATH}/speak`;

            this.host = MIMIC_HOST;
            this.port = MIMIC_PORT;
            this.voice = 'de_DE/m-ailabs_low#ramona_deininger';
            this.noiseScale = '0.333';
            this.noiseW = '0.333';
            this.lengthScale = '1.5';
            this.audioTarget = 'client';

            resolve(this);
        });
    }

    speak(text) {
        const mimicOptions = {
            text: text,
            voice: this.voice,
            noiseScale: this.noiseScale,
            noiseW: this.noiseW,
            lengthScale: this.lengthScale,
            audioTarget: this.audioTarget,
            ssml: 'false'
        };

        const hash = this.createHash(JSON.stringify(mimicOptions));

        return this.exists(hash)
            .then(() => Promise.resolve(hash))          // exists
            .catch(e => this.getAudio(mimicOptions));   // not exists
    }

    exists(hash) {
        const filePath = `${this.storagePath}/${hash}.wav`;
        return new Promise((resolve, reject) => fs.exists(filePath, e => e ? resolve() : reject()));
    }

    getAudio(mimicOptions) {
        return new Promise((resolve, reject) => {
            const hash = this.createHash(JSON.stringify(mimicOptions));
            const filePath = `${this.storagePath}/${hash}.wav`;
            const sendDataString = Object.keys(mimicOptions).map(i => `${i}=${encodeURI(mimicOptions[i])}`).join('&');

            LOG(this.label, 'SEND DATA', sendDataString);

            const options = {
                hostname: `${this.host}`,
                port: this.port,
                path: `/api/tts?${sendDataString}`,
            };

            const req = http.get(options, res => {
                const writeStream = fs.createWriteStream(`${filePath}`);
                res.pipe(writeStream);

                writeStream.on('error', () => reject('Error writing to file!'));
                writeStream.on('finish', () => {
                    writeStream.close(resolve);
                    resolve(hash);
                });
            });

            req.on('error', (e) => ERROR(this.label, ':', e.message));

        });
    }
}