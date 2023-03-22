import ArtistTemplate from "./Templates/artist.html";
import ArtistOptions from "./ArtistOptions.js";
import Modal from "../Modal/index.js";

export default class Artists extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST'

        this.data = options;
        this.id = this.data.id;

        this.target = this.toDOM(ArtistTemplate({
            scope: this.data
        }));
        this.image = this.target.querySelector('img');
        this.image.onclick = () => this.select();

        this.options = new ArtistOptions(this);

    }

    select() {
        LOG(this.label, this.id);
        this.app.tabs.artist.show(this.id);
    }

    highlight() {
        this.target.classList.add('playing');
    }

    blur() {
        this.target.classList.remove('playing');
    }

    show() {
        this.target.classList.remove('hidden');
    }

    hide() {
        this.target.classList.add('hidden');
    }

    toggleHidden() {
        LOG(this.label, 'TOGGLE VISIBILITY FOR ID', this.id);
        return this.fetch(`${this.app.urlBase}/artist/${this.id}/toggle-visibility`).then(response => {
            this.data = response.data;
            if (this.data.is_hidden === 1) {
                this.options.buttonHide.classList.add('active');
                this.target.classList.add('disabled');
            } else {
                this.options.buttonHide.classList.remove('active');
                this.target.classList.remove('disabled');
            }
        });
    }

    edit() {
        LOG(this.label, 'EDIT', this.id, this.data.name);
        this.modal = new Modal(this, {
            ...this.data,
            submit: () => this.submitModal(),
            close: () => this.closeModal()
        });

    }

    submitModal() {
        return new Promise((resolve, reject) => {
            LOG(this.label, 'SUBMIT');

            // 4 testing
            setTimeout(() => resolve(), 1000);
        });
    }

    closeModal() {
        this.removeModal();
    }

    removeModal() {
        delete this.modal;
    }

    read() {
        this.app.speech.speak(this.data.name);
    }

    hideAdmin() {
        this.options.hideAdmin();
    }

    showAdmin() {
        this.options.showAdmin();
    }

}
