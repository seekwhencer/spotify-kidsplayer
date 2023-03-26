import AlbumViewModeTemplate from "./Templates/albums-viewmode.html";

export default class AlbumsViewMode extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUMS VIEW MODE'

        options ? this.options = options : this.options = {};
        this.default = 6;

        this.target = this.toDOM(AlbumViewModeTemplate({
            scope: {
                icons: {
                    book: this.app.icons.book(),
                    music: this.app.icons.music(),
                    podcast: this.app.icons.podcast(),
                    hide: this.app.icons.eye(),
                    edit: this.app.icons.pen(),
                    read: this.app.icons.mouth(),
                    like: this.app.icons.heart()
                }
            }
        }));

        this.parent.viewModeElement.replaceChildren(this.target);

        //this.buttonsGroup = this.target.querySelector('[data-viewmode-buttons]');
        this.buttons = this.target.querySelectorAll('[data-button-viewmode]');
        this.buttons.forEach(button => button.onclick = () => this.select(button.dataset.buttonViewmode));

        this.app.tabs.setup.data.UI_ALBUMS_PER_ROW ? this.mode = parseInt(this.app.tabs.setup.data.UI_ALBUMS_PER_ROW) : this.mode = this.default;
    }

    select(mode) {
        LOG(this.label, 'SET', mode);
        this.mode = mode;
    }

    draw() {
        LOG(this.label, 'DRAW', this.mode);
        this.parent.listElement.className = 'album--listing';
        this.parent.listElement.classList.add(`per-row-${this.mode}`);

        for (let i = 1; i <= 10; i++) {
            i <= this.mode ? this.buttons[i - 1].classList.add('active') : this.buttons[i - 1].classList.remove('active');
        }
    }

    get mode() {
        return this._mode;
    }

    set mode(val) {
        this._mode = val;
        this.draw();
    }


}
