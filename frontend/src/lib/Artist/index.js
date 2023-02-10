import Tab from '../Tab.js';
import Album from './Album.js';

import ArtistTemplate from "./Templates/artist.html";
import DetailsTemplate from "./Templates/details.html";

export default class Artist extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ARTIST'
        this.tab = 'artist';

        this.target = this.toDOM(ArtistTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.detailsElement = this.target.querySelector('[data-artist-detail]');
        this.listingElement = this.target.querySelector('[data-album-listing]');

        this.on('raw', () => this.populate());
        this.on('albums', () => this.draw());
    }

    show(id) {
        super.show();
        this.getArtist(id);
    }

    getArtist(id) {
        this.fetch(`${this.app.urlBase}/artist/${id}`).then(raw => this.raw = raw.data);
    }

    populate() {
        const albums = [];
        this.raw.albums.forEach(album => albums.push(new Album(this, album)));
        this.albums = albums;
    }

    draw() {
        this.detailsElement.innerHTML = '';
        this.listingElement.innerHTML = '';

        const details = this.toDOM(DetailsTemplate({
            scope: this.raw
        }));
        this.detailsElement.append(details);
        this.albums.forEach(album => this.listingElement.append(album.target));
    }

    get albums() {
        return this._albums;
    }

    set albums(data) {
        this._albums = data;
        this.emit('albums');
    }

    get raw() {
        return this._raw;
    }

    set raw(data) {
        this._raw = data;
        this.emit('raw');
    }

}
