import AlbumsTemplate from "./Templates/albums.html";
import Album from './Album.js';

export default class Albums extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUMS'

        this.target = this.toDOM(AlbumsTemplate({
            scope: options
        }));

        this.albums = [];
        options.albums.forEach(album => this.albums.push(new Album(this, album)));
    }
}
