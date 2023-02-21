export default class Speech extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SPEECH';
        this.on('data', () => this.play());
    }

    speak(text) {
        const data = {
            text: text
        };
        this.getAudio(data);
    }

    getAudio(data) {
        this.fetchAudio(`${this.app.urlBase}/speak`, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(raw => this.data = raw);
    }

    play() {
        this.stop();

        this.audioElement = document.createElement('audio');
        this.audioElement.src = URL.createObjectURL(this.data);
        this.audioElement.onloadeddata = () => this.audioElement.play();
        this.audioElement.load();
    }

    stop() {
        if (this.audioElement) {
            this.audioElement.pause()
            this.audioElement.src = '';
            this.audioElement.load();
            delete this.audioElement;
        }
    }

    get data() {
        return this._data;
    }

    set data(val) {
        this._data = val;
        this.emit('data');
    }

}
