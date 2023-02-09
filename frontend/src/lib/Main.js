import './Global/Globals.js';
import Navigation from './Navigation/index.js';
import Home from './Home/index.js';
import Setup from './Setup/index.js'
import Browser from './Browser/index.js';
import Player from './Player/index.js';

export default class Main extends MODULECLASS {
    constructor(options) {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'APP';
            console.log(this.label, 'INIT');

            this.app = this;
            this.options = options;

            this.apiBaseUrl = `${window.location.origin}/api`;
            this.urlBase = `${this.apiBaseUrl}`;

            this.rootElement = this.options.target;
            this.target = this.rootElement;

            console.log(this.label, this.apiBaseUrl, this.urlBase, 'YAY');

            this.on('ready', () => resolve(this));

            this.navigation = new Navigation(this);
            this.setup = new Setup(this);
            this.home = new Home(this);
            this.browser = new Browser(this);


            this.emit('ready');

        });
    }
}



