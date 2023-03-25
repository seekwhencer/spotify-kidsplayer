import Tab from '../Tab.js';
import ArtistDetails from './Details.js';
import ArtistPlayed from './Played.js';
import ArtistAlbums from './Albums.js';
import ArtistOptions from './Options.js';

import LayoutTemplate from "./Templates/layout.html";

export default class Artist extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ARTIST'
        this.tab = 'artist';
        this.filter = [];

        this.data = new Proxy(this.raw, {
            get: (target, prop, receiver) => target[prop] || this.raw[prop],
            set: (target, prop, value) => {
                target[prop] = value;
                return true;
            }
        });

        this.target = this.toDOM(LayoutTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.detailsElement = this.target.querySelector('[data-artist-details]');
        this.optionsElement = this.target.querySelector('[data-artist-options]');
        this.playedElement = this.target.querySelector('[data-artist-played]');
        this.albumsElement = this.target.querySelector('[data-artist-albums]');

        this.parent.on('parent-mode', parentMode => this.toggleParentMode(parentMode));

    }

    show(id) {
        if (this.data.id !== id) {
            this.getArtist(id).then(() => this.draw(true));
        } else {
            this.draw(false);
        }
    }

    hide() {
        super.hide();
    }

    getArtist(id) {
        return this.fetch(`${this.app.urlBase}/artist/${id}`).then(raw => {
            this.raw = raw.data;
            return Promise.resolve(true);
        });
    }

    draw(full) {
        if (full) {
            this.played = new ArtistPlayed(this, this.raw);
            this.details = new ArtistDetails(this, this.raw);
            this.albums = new ArtistAlbums(this, this.raw);
            //this.options = new ArtistOptions(this, this.raw);

            this.detailsElement.replaceChildren(this.details.target[0], this.details.target[1]);
            this.playedElement.replaceChildren(this.played.target);
            this.albumsElement.replaceChildren(this.albums.target[0], this.albums.target[1]);
            //this.optionsElement.replaceChildren(this.options.target);

            this.albumsElement.scroll(0, 0);
            this.app.navigation.clearFilter();
            this.toggleParentMode();

            this.app.emit('filter', 'audiobook'); // chose the audiobook filter
        }

        this.setBackgroundImage();
        this.app.navigation.draw(this.albums.filter);
        super.show();
    }

    toggleFilter(filter) {
        LOG(this.label, 'TOGGLE FILTER:', filter);
        this.albums.toggleFilter(filter);
    }

    toggleParentMode(parentMode) {
        this.app.tabs.setup.parentMode === true ? this.showAdmin() : this.hideAdmin();
    }

    setBackgroundImage() {
        APP.background.set(`${APP.mediaBaseUrl}/${this.raw.image}.jpg`);
    }

    showAdmin() {
        this.albums ? this.albums.showAdmin() : null;
        this.options ? this.options.showAdmin() : null;
    }

    hideAdmin() {
        this.albums ? this.albums.hideAdmin() : null;
        this.options ? this.options.hideAdmin() : null;
    }

    get raw() {
        return this._raw || {};
    }

    set raw(data) {
        this._raw = data;
    }

}
