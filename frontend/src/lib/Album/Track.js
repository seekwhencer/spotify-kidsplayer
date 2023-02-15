import TrackTemplate from "./Templates/track.html";

export default class Track extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUM TRACK'
        this.parent = parent;

        this.id = options.id;
        this.name = options.name;
        this.track_number = options.track_number;
        this.spotify_id = options.spotify_id;

        this.target = this.toDOM(TrackTemplate({
            scope: options
        }));
        parent.target.append(this.target);
        this.target.onclick = () => this.select();
    }

    select() {
        LOG(this.label, this.id);
        this.active = true;
        this.parent.unselectAll(this.id);
        this.highlight();
        this.showDetails();
    }

    showDetails() {
        this.app.tabs.album.showTrackDetails(this);
    }

    highlight() {
        this.target.classList.add('active');
    }

    unselect() {
        this.active = false;
        this.target.classList.remove('active');
    }

}
