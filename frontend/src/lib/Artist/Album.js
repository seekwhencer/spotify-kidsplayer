import AlbumTemplate from "./Templates/album.html";

export default class Album extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST ALBUM'

        //LOG(this.label, options);

        this.id = options.id;

        this.target = this.toDOM(AlbumTemplate({
            scope: options
        }));

        this.target.onclick = () => this.select();

        this.image = this.target.querySelector('img');
        this.image.onload = () => this.target.classList.add('loaded');
        this.image.onerror = () => this.target.classList.add('hidden');

    }

    select() {
        LOG(this.label, this.id);
        this.app.tabs.album.show(this.id);
    }

}