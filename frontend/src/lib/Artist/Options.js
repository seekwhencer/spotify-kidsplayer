import OptionsTemplate from "./Templates/options.html";

export default class Options extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST OPTIONS'

        //LOG(this.label, options);

        this.id = options.id;

        this.target = this.toDOM(OptionsTemplate({
            scope: {
                id: options.id,
                name: options.name,
                image: options.image,
                albums: options.albums.length
            }
        }));
    }

    showAdmin() {
        this.target.style.display = 'block';
    }

    hideAdmin() {
        this.target.style.display = 'none';
    }
}
