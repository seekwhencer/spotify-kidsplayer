import TrackTemplate from "./Templates/track.html";

export default class Track extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUM TRACK'
        this.id = options.id;

        this.target = this.toDOM(TrackTemplate({
            scope: options
        }));
        parent.target.append(this.target);
        this.target.onclick = () => this.select();
    }

    select() {
        LOG(this.label, this.id);
        //this.app.tabs.artist.show(this.id);
    }
}
