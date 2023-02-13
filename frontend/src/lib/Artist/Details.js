import DetailsTemplate from "./Templates/details.html";

export default class Details extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST DETAILS'

        //LOG(this.label, options);

        this.id = options.id;

        this.target = this.toDOM(DetailsTemplate({
            scope: {
                id: options.id,
                name: options.name,
                image: options.image,
                albums: options.albums.length
            }
        }));
    }
}
