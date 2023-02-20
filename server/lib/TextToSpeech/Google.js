import https from 'https';
import fs from 'fs';
import TTSClass from './Class.js';

export default class GoogleTTS extends TTSClass {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'GOOGLE TTS';
        LOG(this.label, 'INIT');

        //https://translate.google.com/translate_tts?
        // ie=UTF-8
        // &q=17%3A%20Gro%C3%9Fe%20Entdecker%20%2F%20Polargebiete
        // &tl=de
        // &total=1
        // &idx=0
        // &textlen=34
        // &client=tw-ob
        // &prev=input
        // &ttsspeed=0.24

        this.host = TTS_GOOGLE_HOST;
        this.speed = TTS_GOOGLE_SPEED;
        this.language = 'de';

    }

    speak(text) {
        const serviceOptions = {
            ie: 'UTF-8',
            q: encodeURI(text),
            tl: this.language,
            total: 1,
            idx: 0,
            textlen: text.length,
            client: 'tw-ob',
            prev: 'input',
            ttsspeed: this.speed
        }

        /*const serviceOptions = {
            lang: 'de',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        };*/

        const hash = this.createHash(`${text}${JSON.stringify(serviceOptions)}`);

        return this.exists(hash, 'mp3')
            .then(() => Promise.resolve(hash))                       // exists
            .catch(e => this.getAudio(serviceOptions, text, hash));  // not exists
    }

    getAudio(serviceOptions, text, hash) {
        return new Promise((resolve, reject) => {
            const filePath = `${this.storagePath}/${hash}.mp3`;
            const sendDataString = Object.keys(serviceOptions).map(i => `${i}=${serviceOptions[i]}`).join('&');

            LOG(this.label, 'SEND DATA', sendDataString);

            const requestOptions = {
                hostname: `${this.host}`,
                path: `/translate_tts?${sendDataString}`,
            };

            const req = https.get(requestOptions, res => {
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
