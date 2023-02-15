import AlbumsTemplate from "./Templates/albums.html";
import Album from './Album.js';

export default class Albums extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUMS'

        LOG('>>>', options);

        this.target = this.toDOM(AlbumsTemplate({
            scope: {}
        }));

        this.albums = [];
        options.albums.forEach(album => this.albums.push(new Album(this, album)));

    }
}
