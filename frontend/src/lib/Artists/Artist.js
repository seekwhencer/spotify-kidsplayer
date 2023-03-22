import ArtistTemplate from "./Templates/artist.html";
import ArtistOptions from "./ArtistOptions.js";

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

    toggleHidden() {
        LOG(this.label, 'TOGGLE VISIBILITY FOR ID', this.id);
        return this.fetch(`${this.app.urlBase}/artist/${this.id}/toggle-visibility`).then(response => {
            this.data = response.data;
            if (this.data.is_hidden === 1) {
                this.options.buttonHide.classList.add('active');
                this.target.classList.add('hidden');
            } else {
                this.options.buttonHide.classList.remove('active');
                this.target.classList.remove('hidden');
            }
        });
    }

    edit() {

    }

    read() {
        this.app.speech.speak(this.data.name);
    }

}
