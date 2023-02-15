import './Global/Globals.js';
import Translation from './Global/Translation/index.js';
import * as Icons from './Icons/index.js';

import Navigation from './Navigation/index.js';
import Browser from './Browser/index.js';
import Player from './Player/index.js';

import Home from './Home/index.js';
import Artists from './Artists/index.js';
import Artist from './Artist/index.js';
import Album from './Album/index.js';
import Music from './Music/index.js';
import Audiobooks from './Audiobooks/index.js';
import Setup from './Setup/index.js';

export default class Main extends MODULECLASS {
    constructor(options) {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'APP';
            LOG(this.label, 'INIT');

            this.app = this;
            this.options = options;

            this.icons = Icons;

            this.mediaBaseUrl = `${window.location.origin}/media`;
            this.apiBaseUrl = `${window.location.origin}/api`;
            this.urlBase = `${this.apiBaseUrl}`;

            this.rootElement = this.options.target;
            this.target = this.rootElement;

            LOG(this.label, 'API BASE URL:', this.urlBase);

            // this class
            this.on('ready', () => resolve(this));

            // on a tab change
            this.on('tab', tab => {
                // display a tab
                this.showTab(tab);

                // dummy
                this.emit(`tab-${tab}`);
            });

            this.i3n = new Translation(this);

            // things
            this.navigation = new Navigation(this);
            this.player = new Player(this);
            this.browser = new Browser(this);

            // tabs
            this.tabs = {
                home: new Home(this),
                artists: new Artists(this),
                artist: new Artist(this),
                album: new Album(this),
                audiobooks: new Audiobooks(this),
                music: new Music(this),
                setup: new Setup(this)
            }

            // finally ;)
            this.emit('ready');

        });
    }

    showTab(tab) {
        this.tabs[tab].show();
    }

}



