import AlbumTemplate from './Templates/album.html';
import AlbumOptions from './AlbumOptions.js';

export default class Album extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST ALBUM';

        this.data = options;
        this.id = options.id;

        this.target = this.toDOM(AlbumTemplate({
            scope: {
                ...this.data,
                parentMode: this.app.tabs.setup.parentMode
            }
        }));

        parent.listElement.append(this.target);

        this.image = this.target.querySelector('img');
        this.image.onclick = () => this.select();
        this.image.onload = () => this.target.classList.add('loaded');
        this.image.onerror = () => this.target.classList.add('hidden');

        this.albumOptions = new AlbumOptions(this);
    }

    select() {
        LOG(this.label, this.id);
        this.app.tabs.album.show(this.id);
    }

    show() {
        this.target.classList.remove('hidden');
    }

    hide() {
        this.target.classList.add('hidden');
    }

    toggleType(type) {
        LOG(this.label, 'TOGGLE TYPE', type, 'FOR ID', this.id);
        return this.fetch(`${this.app.urlBase}/album/${this.id}/type/${type}`).then(response => {
            this.data = response.data;
            const type = this.data.type;
            const buttons = {
                music: this.albumOptions.buttonMusic,
                audiobook: this.albumOptions.buttonAudiobook,
                podcast: this.albumOptions.buttonPodcast,
            };
            Object.values(buttons).forEach(button => button.classList.remove('active'));
            buttons[type].classList.add('active');
        });
    }

    toggleHidden() {
        LOG(this.label, 'TOGGLE VISIBILITY FOR ID', this.id);
        return this.fetch(`${this.app.urlBase}/album/${this.id}/toggle-visibility`).then(response => {
            this.data = response.data;
            if (this.data.is_hidden === 1) {
                this.albumOptions.buttonHide.classList.add('active');
                this.target.classList.add('disabled');
            } else {
                this.albumOptions.buttonHide.classList.remove('active');
                this.target.classList.remove('disabled');
            }
        });
    }

    toggleLiked() {
        LOG(this.label, 'TOGGLE LIKED FOR ID', this.id);
        return this.fetch(`${this.app.urlBase}/album/${this.id}/toggle-liked`).then(response => {
            this.data = response.data;
            this.data.is_liked === 1 ? this.albumOptions.buttonLike.classList.add('active') : this.albumOptions.buttonLike.classList.remove('active');
        });
    }

    edit() {

    }

    read() {
        this.app.speech.speak(this.data.name);
    }

    highlight() {
        this.target.classList.add('playing');
    }

    blur() {
        this.target.classList.remove('playing');
    }

    hideAdmin() {
        this.albumOptions.hideAdmin();
    }

    showAdmin() {
        this.albumOptions.showAdmin();
    }
}
