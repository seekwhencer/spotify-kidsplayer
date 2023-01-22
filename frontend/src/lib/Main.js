import './Global/Globals.js';

export default class Main extends MODULECLASS {
    constructor(options) {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'APP';
            console.log(this.label, 'INIT');

            this.app = this;

            // @TODO
            this.options = options;

            this.apiBaseUrl = `${window.location.origin}`;
            this.urlBase = `${this.apiBaseUrl}/v1`;

            this.rootElement = this.options.target;
            this.target = this.rootElement;

            // the main app ready trigger
            // use it: this.app.on('ready' , ...) inside a MODULECLASS
            this.on('ready', () => resolve());

            // ..
            this.emit('ready');

        });
    }
}
