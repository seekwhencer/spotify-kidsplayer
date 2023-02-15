import Tab from '../Tab.js';
import ArtistDetails from './Details.js';
import ArtistPlayed from './Played.js';
import ArtistAlbums from './Albums.js';

import LayoutTemplate from "./Templates/layout.html";

export default class Artist extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ARTIST'
        this.tab = 'artist';

        this.target = this.toDOM(LayoutTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.detailsElement = this.target.querySelector('[data-artist-details]');
        this.playedElement = this.target.querySelector('[data-artist-played]');
        this.albumsElement = this.target.querySelector('[data-artist-albums]');

        this.on('raw', () => this.populate());
    }

    show(id) {
        if (!this.raw) {
            this.getArtist(id);
        } else {
            if (this.raw.id !== id) {
                this.getArtist(id);
            }
        }
        super.show();
    }

    hide() {
        super.hide();
    }

    getArtist(id) {
        this.fetch(`${this.app.urlBase}/artist/${id}`).then(raw => this.raw = raw.data);
    }

    populate() {
        this.played = new ArtistPlayed(this, this.raw);
        this.details = new ArtistDetails(this, this.raw);
        this.albums = new ArtistAlbums(this, this.raw);

        this.draw();
    }

    draw() {
        this.detailsElement.replaceChildren(this.details.target[0], this.details.target[1]);
        this.playedElement.replaceChildren(this.played.target);
        this.albumsElement.replaceChildren(this.albums.target);
        this.albumsElement.scroll(0,0);

    }

    setBackgroundImage() {
        //document.querySelector('body').style.backgroundImage = `url(${APP.mediaBaseUrl}/${this.raw.image}.jpg)`;
    }

    get raw() {
        return this._raw;
    }

    set raw(data) {
        this._raw = data;
        this.emit('raw');
    }

}
