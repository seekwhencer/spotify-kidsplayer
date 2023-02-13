import Tab from '../Tab.js';
import Album from './Album.js';
import ArtistDetails from './Details.js';
import ArtistPlayed from './Played.js';

import ArtistTemplate from "./Templates/artist.html";

export default class Artist extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ARTIST'
        this.tab = 'artist';

        this.target = this.toDOM(ArtistTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.detailsElement = this.target.querySelector('[data-artist-details]');
        this.playedElement = this.target.querySelector('[data-artist-played]');
        this.listingElement = this.target.querySelector('[data-album-listing]');

        this.on('raw', () => this.populate());
        this.on('albums', () => this.draw());
    }

    show(id) {
        if(!this.raw){
            this.getArtist(id);
        } else {
            if(this.raw.id !== id){
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
        const albums = [];
        this.raw.albums.forEach(album => albums.push(new Album(this, album)));
        this.played = new ArtistPlayed(this, this.raw);
        this.details = new ArtistDetails(this, this.raw);
        this.albums = albums;
    }

    draw() {
        this.detailsElement.replaceChildren(this.details.target[0], this.details.target[1]);
        this.playedElement.replaceChildren(this.played.target);
        this.setBackgroundImage();
        this.listingElement.innerHTML = '';
        this.listingElement.scroll(0,0);
        this.albums.forEach(album => this.listingElement.append(album.target));
    }

    setBackgroundImage() {
        //document.querySelector('body').style.backgroundImage = `url(${APP.mediaBaseUrl}/${this.raw.image}.jpg)`;
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
