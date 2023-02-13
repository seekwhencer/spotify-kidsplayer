import PlayedTemplate from "./Templates/played.html";

export default class Played extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUM PLAYED'

        //LOG(this.label, options);

        this.id = options.id;

        this.target = this.toDOM(PlayedTemplate({
            scope: {}
        }));
    }
}
