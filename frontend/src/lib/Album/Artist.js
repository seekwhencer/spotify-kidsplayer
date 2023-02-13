import ArtistTemplate from "./Templates/artist.html";

export default class Artist extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST DETAILS'

        //LOG(this.label, options);

        this.id = options.id;

        this.target = this.toDOM(ArtistTemplate({
            scope: {
                id: options.id,
                name: options.name,
                image: options.image
            }
        }));

        this.parent.artistElement.onclick = () => this.select();
    }

    select() {
        LOG(this.label, this.id);
        this.app.tabs.artist.show(this.id);
    }
}
