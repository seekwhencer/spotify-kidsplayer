import TrackDetailsTemplate from "./Templates/trackdetails.html";

export default class TrackDetails extends MODULECLASS {
    constructor(parent, track) {
        super(parent);
        this.label = 'TRACK DETAILS'

        this.album = parent;

        this.id = track.id;
        this.name = track.name;
        this.spotify_id = track.spotify_id;

        this.show();
    }

    show(){
        this.target = this.toDOM(TrackDetailsTemplate({
            scope: {
                id: this.id,
                name: this.name,
                spotify_id: this.spotify_id
            }
        }));
        this.album.trackDetailsElement.replaceChildren(this.target);
    }

    hide() {
        this.target.innerHTML = '';
    }
}
