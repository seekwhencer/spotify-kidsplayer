import DetailsTemplate from "./Templates/details.html";

export default class Details extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUM DETAILS'

        //LOG(this.label, options);

        this.id = options.id;

        this.target = this.toDOM(DetailsTemplate({
            scope: {
                id: options.id,
                name: options.name,
                image: options.image,
                tracks: options.tracks.length
            }
        }));
    }
}
