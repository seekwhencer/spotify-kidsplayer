import AlbumOptionsTemplate from "./Templates/album-options.html";

export default class AlbumOptions extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST ALBUM OPTIONS'
        this.album = parent;
        options ? this.options = options : this.options = {};

        this.target = this.toDOM(AlbumOptionsTemplate({
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
                ...this.album.data
            }
        }));

        this.buttonAudiobook = this.target.querySelector('[data-button-type-audiobook]');
        this.buttonMusic = this.target.querySelector('[data-button-type-music]');
        this.buttonPodcast = this.target.querySelector('[data-button-type-podcast]');

        this.buttonHide = this.target.querySelector('[data-button-hide]');
        this.buttonEdit = this.target.querySelector('[data-button-edit]');

        this.buttonRead = this.target.querySelector('[data-button-read]');
        this.buttonLike = this.target.querySelector('[data-button-like]');

        this.buttonAudiobook.onclick = () => this.album.toggleType('audiobook');
        this.buttonMusic.onclick = () => this.album.toggleType('music');
        this.buttonPodcast.onclick = () => this.album.toggleType('podcast');
        this.buttonHide.onclick = () => this.album.toggleHidden();
        this.buttonEdit.onclick = () => this.album.edit();
        this.buttonRead.onclick = () => this.album.read();
        this.buttonLike.onclick = () => this.album.toggleLiked();

        this.album.target.append(this.target);

    }

}
