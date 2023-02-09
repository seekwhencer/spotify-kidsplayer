import ArtistTemplate from "./Templates/artist.html";

export default class Artists extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST'

        LOG(this.label, options);

        this.target = this.toDOM(ArtistTemplate({
            scope: options
        }));
    }

}
