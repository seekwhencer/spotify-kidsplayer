import ArtistTemplate from "./Templates/artist.html";

export default class Artists extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST'

        //LOG(this.label, options);

        this.id = options.id;

        this.target = this.toDOM(ArtistTemplate({
            scope: options
        }));

        this.target.onclick = () => this.select();
    }

    select() {
        LOG(this.label, this.id);
        this.app.tabs.artist.show(this.id);
    }

    highlight() {
        this.target.classList.add('playing');
    }

    blur() {
        this.target.classList.remove('playing');
    }

}
