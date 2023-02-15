
import TracksTemplate from "./Templates/tracks.html";
import Track from './Track.js';

export default class Tracks extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'TRACKS'

        this.target = this.toDOM(TracksTemplate({
            scope: {}
        }));

        this.tracks = [];
        options.tracks.forEach(track => this.tracks.push(new Track(this, track)));
    }

    unselectAll(id) {
        this.tracks.forEach(track => id !== track.id ? track.unselect() : null);
    }
}
