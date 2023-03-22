import Tab from '../Tab.js';
import Artist from './Artist.js';

import ArtistsTemplate from "./Templates/artists.html";

export default class Artists extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ARTISTS'
        this.tab = 'artists';

        this.target = this.toDOM(ArtistsTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
        this.listingElement = this.target.querySelector('[data-listing]');

        this.on('raw', () => this.populate());
        this.on('data', () => this.draw());
        this.parent.on('parent-mode', parentMode => this.toggleParentMode(parentMode));
    }

    show() {
        super.show();
        this.getAll();
    }

    getAll() {
        this.fetch(`${this.app.urlBase}/artists`).then(raw => this.raw = raw.data);
    }

    populate() {
        const items = [];
        this.raw.forEach(artist => items.push(new Artist(this, artist)));
        this.items = items;
    }

    draw() {
        this.listingElement.innerHTML = '';
        this.items.forEach(artist => this.listingElement.append(artist.target));
        this.app.navigation.disableFilter();
        this.app.player.on('artist', () => this.highlightPlaying());
        this.highlightPlaying();
        this.toggleHidden();
        this.toggleParentMode();
    }

    blurAll(id) {
        this.items.forEach(artist => artist.id !== id ? artist.blur() : null);
    }

    highlightPlaying() {
        const playingArtist = this.items.filter(a => a.id === this.app.player.artist.id)[0];

        if (!playingArtist)
            return;

        this.blurAll(playingArtist.id);
        playingArtist.highlight();

        LOG(this.label, 'SWITCH ARTIST', playingArtist);
    }

    toggleHidden() {
        LOG(this.label, 'TOGGLE HIDDEN');

        this.items.forEach(artist => {
            artist.hide();

            if (this.app.tabs.setup.parentMode === false && artist.data.is_hidden === 1)
                return;

            artist.show();
        });
    }

    toggleParentMode() {
        this.parent.tabs.setup.parentMode === true ? this.showAdmin() : this.hideAdmin();
    }

    showAdmin() {
        this.toggleHidden();
        this.items.forEach(artist => artist.showAdmin());
    }

    hideAdmin() {
        this.toggleHidden();
        this.items.forEach(artist => artist.hideAdmin());
    }

    get items() {
        return this._items;
    }

    set items(data) {
        this._items = data;
        this.emit('data');
    }

    get raw() {
        return this._raw;
    }

    set raw(data) {
        this._raw = data;
        this.emit('raw');
    }

}
