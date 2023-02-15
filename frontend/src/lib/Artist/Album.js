import AlbumTemplate from './Templates/album.html';
import AlbumOptions from './AlbumOptions.js';

export default class Album extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST ALBUM'

        this.id = options.id;

        this.target = this.toDOM(AlbumTemplate({
            scope: options
        }));

        parent.target.append(this.target);

        this.image = this.target.querySelector('img');
        this.image.onclick = () => this.select();
        this.image.onload = () => this.target.classList.add('loaded');
        this.image.onerror = () => this.target.classList.add('hidden');

        this.optionsElement = new AlbumOptions(this);

    }

    select() {
        LOG(this.label, this.id);
        this.app.tabs.album.show(this.id);
    }

    toggleType(type) {
        LOG(this.label, 'TOGGLE TYPE', type, 'FOR ID', this.id);
    }

    setHidden() {
        LOG(this.label, 'SET HIDDEN FOR ID', this.id);
    }

    edit() {

    }

}
