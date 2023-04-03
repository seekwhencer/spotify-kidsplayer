import './Global/Globals.js';

import Locale from './Locale/index.js';
import * as Icons from './Icons/index.js';

import Navigation from './Navigation/index.js';
import Player from './Player/index.js';
import Speech from './Speech/index.js';

// tabs
import Home from './Home/index.js';
import Artists from './Artists/index.js';
import Artist from './Artist/index.js';
import Album from './Album/index.js';
import Music from './Music/index.js';
import Audiobooks from './Audiobooks/index.js';
import Setup from './Setup/index.js';
import Background from './Background/index.js';

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
            this.on('ready', () => {
                this.showTab('artists');
                resolve(this)
            });

            // on a tab change
            this.on('tab', tab => {
                // display a tab
                this.showTab(tab);

                // dummy
                this.emit(`tab-${tab}`);
            });

            // on a filter change
            this.on('filter', filter => {
                this.toggleFilter(filter);
            });

            // things
            this.locale = new Locale(this);
            this.background = new Background(this);
            this.navigation = new Navigation(this);
            this.player = new Player(this);
            this.speech = new Speech(this);

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

            this.navigation.disableFilter();

            // finally ;)
            this.emit('ready');

        });
    }

    showTab(tab) {
        this.tabs[tab].show();
    }

    toggleFilter(filter) {
        LOG(this.label, 'CHANGE FILTER', filter);
        this.tabs.artist.toggleFilter(filter);
    }

}



