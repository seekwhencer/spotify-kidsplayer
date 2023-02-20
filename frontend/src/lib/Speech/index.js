import SpeechTemplate from "./Templates/speech.html";

export default class Speech extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SPEECH';

        this.target = this.toDOM(SpeechTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

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
        this.audioElement = document.createElement("audio");
        this.audioElement.src = URL.createObjectURL(this.data);
        this.audioElement.onloadeddata = () => this.audioElement.play();
        this.audioElement.load();
    }

    get data() {
        return this._data;
    }

    set data(val) {
        this._data = val;
        this.emit('data');
    }

}
