import Tab from '../Tab.js';

import LayoutTemplate from './Templates/layout.html';
import AlbumDetails from './Details.js';
import AlbumPlayed from './Played.js';
import AlbumArtist from './Artist.js';
import AlbumTracks from './Tracks.js';
import TrackDetails from './TrackDetails.js';
import ArtistAlbums from './Albums.js';

export default class Album extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ALBUM'
        this.tab = 'album';

        this.target = this.toDOM(LayoutTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.detailsElement = this.target.querySelector('[data-album-details]');
        this.artistElement = this.target.querySelector('[data-album-artist]');
        this.playedElement = this.target.querySelector('[data-album-played]');
        this.tracksElement = this.target.querySelector('[data-album-tracks]');
        this.albumsElement = this.target.querySelector('[data-artist-albums]');
        this.trackDetailsElement = this.target.querySelector('[data-track-details]');

        this.on('raw', () => this.populate());
    }

    show(id) {
        this.getAlbum(id);
        super.show();
        this.app.navigation.disableFilter();
    }

    hide() {
        super.hide();
    }

    getAlbum(id) {
        this.fetch(`${this.app.urlBase}/album/${id}`).then(raw => this.raw = raw.data);
    }

    populate() {
        this.details = new AlbumDetails(this, this.raw);
        this.artist = new AlbumArtist(this, this.raw.artist);
        this.played = new AlbumPlayed(this, this.raw);
        this.albumTracks = new AlbumTracks(this, this.raw);
        //this.albums = new ArtistAlbums(this, this.raw.artist);

        this.draw();
    }

    draw() {
        this.setBackgroundImage();
        this.detailsElement.replaceChildren(this.details.target[0], this.details.target[1]);
        this.artistElement.replaceChildren(this.artist.target[0], this.artist.target[1]);
        this.playedElement.replaceChildren(this.played.target);
        this.tracksElement.replaceChildren(this.albumTracks.target);
        //this.albumsElement.replaceChildren(this.albums.target);

        // select the first track
        //this.albumTracks.tracks[0].select();
        //this.albums.addSlider();

        this.hideTrackDetails();
        this.setBackgroundImage();
    }

    showTrackDetails(track) {
        this.trackDetails = new TrackDetails(this, track);
    }

    hideTrackDetails(){
        this.trackDetails ? this.trackDetails.hide() : null;
    }

    setBackgroundImage() {
        APP.background.set(`${APP.mediaBaseUrl}/${this.raw.image}.jpg`);
    }

    get raw() {
        return this._raw;
    }

    set raw(data) {
        this._raw = data;
        this.emit('raw');
    }

}
