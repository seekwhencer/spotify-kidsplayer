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
            this.urlBase = `${this.apiBaseUrl}`;

            this.rootElement = this.options.target;
            this.target = this.rootElement;

            console.log(this.label, this.apiBaseUrl, this.urlBase, 'YAY');

            this.on('ready', () => resolve());

            // .. :-)
            this.emit('ready');

        });
    }
}
