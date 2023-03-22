import ArtistOptionsTemplate from "./Templates/artist-options.html";

export default class ArtistOptions extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST OPTIONS'
        this.artist = parent;
        options ? this.options = options : this.options = {};

        this.target = this.toDOM(ArtistOptionsTemplate({
            scope: {
                icons: {
                    book: this.app.icons.book(),
                    music: this.app.icons.music(),
                    podcast: this.app.icons.podcast(),
                    hide: this.app.icons.eye(),
                    edit: this.app.icons.pen(),
                    read: this.app.icons.mouth(),
                    like: this.app.icons.heart()
                },
                ...this.artist.data
            }
        }));

        this.buttonHide = this.target.querySelector('[data-button-hide]');
        this.buttonEdit = this.target.querySelector('[data-button-edit]');
        this.buttonRead = this.target.querySelector('[data-button-read]');

        this.buttonHide.onclick = () => this.artist.toggleHidden();
        this.buttonEdit.onclick = () => this.artist.edit();
        this.buttonRead.onclick = () => this.artist.read();

        this.artist.target.append(this.target);
    }

    hideAdmin() {
        this.buttonHide.style.display = 'none';
        this.buttonEdit.style.display = 'none';
    }

    showAdmin() {
        this.buttonHide.style.display = 'block';
        this.buttonEdit.style.display = 'block';
    }


}
