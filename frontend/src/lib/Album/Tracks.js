import TracksTemplate from "./Templates/tracks.html";
import Track from './Track.js';

export default class Tracks extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'TRACKS'

        this.target = this.toDOM(TracksTemplate({
            scope: {}
        }));

        this.duration = 0;
        options.tracks.forEach(track => this.duration = this.duration + parseInt(track.duration_ms));

        this.tracks = [];
        options.tracks.forEach(track => this.tracks.push(new Track(this, track)));
    }

    unselectAll(id) {
        !id ? id = 0 : null;
        this.tracks.forEach(track => id !== track.id ? track.unselect() : null);
    }

    highlightPlaying(id) {
        !id ? id = 0 : null;
        this.tracks.forEach(track => id !== track.id ? track.highlightPlaying(false) : null);
    }
}
