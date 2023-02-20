import Mimic from './Mimic.js';
import GoogleTTS from './Google.js';

export default class TextToSpeech extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'TTS';
            LOG(this.label, 'INIT');

            this.storagePath = `${STORAGE_CONTAINER_PATH}/speak`;
            this.options = {};

            this.mimic = new Mimic(this);
            this.google = new GoogleTTS(this);

            resolve(this);
        });
    }

    speak(text) {
        return this.google.speak(text);
        //return this.mimic.speak(text);
    }

}