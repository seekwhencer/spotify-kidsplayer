import TrackDetailsTemplate from "./Templates/trackdetails.html";

export default class TrackDetails extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'TRACK DETAILS'
        this.id = options.id;

        this.target = this.toDOM(TrackDetailsTemplate({
            scope: {
                id: options.id,
                name: options.name,
                spotify_id: options.spotify_id
            }
        }));
    }

    hide() {
        this.target = '';
    }
}
