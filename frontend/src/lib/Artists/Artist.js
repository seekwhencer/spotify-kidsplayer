import ArtistTemplate from "./Templates/artist.html";
import ArtistOptions from "./ArtistOptions.js";
import Modal from "../Modal/index.js";
import ModalEditBody from "./Templates/artist-edit.html";

export default class Artists extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ARTIST'

        this.data = options;
        this.id = this.data.id;

        this.target = this.toDOM(ArtistTemplate({
            scope: this.data
        }));
        this.image = this.target.querySelector('[data-artist-image]');
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

        return this.fetch(`${this.app.urlBase}/artist/${this.id}`).then(response => {

            const modalBody = toDOM(ModalEditBody({
                scope: response.data
            }));

            this.modal = new Modal(this, {
                ...response.data,

                title: '',

                // if true, then call "this.modal.open()" to show it
                silent: true,

                // the dom element
                body: modalBody,

                // the behavior
                open: () => this.openModal(),
                submit: () => this.submitModal(),
                close: () => this.closeModal()
            });

            // shows the modal, because it's silent
            this.modal.open();
        });
    }

    openModal() {
        LOG(this.label, 'MODAL OPENED FINALLY');

        // stuff when the modal is open
        const inputElement = this.modal.target.querySelector('[data-input="name"]');
        inputElement.focus();
        inputElement.onkeyup = () => `${inputElement.value}` === `${this.data.name}` ? inputElement.classList.remove('update') : inputElement.classList.add('update');

        // image url button
        const downloadButton = this.modal.target.querySelector('[data-button="download"]');
        downloadButton.onclick = () => this.downloadImage();

        // images
        const imageElements = this.modal.target.querySelectorAll('[data-artist-image]');
        imageElements.forEach(image => image.onclick = () => this.setPoster(image.dataset.artistImage));
    }

    submitModal() {
        return new Promise((resolve, reject) => {
            LOG(this.label, 'SUBMIT');

            const inputName = this.modal.target.querySelector('[data-input="name"]');

            const postData = {
                name: inputName.value,
                posterImageId: this.posterImageId
            }

            return this.fetch(`${this.app.urlBase}/artist/update/${this.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            }).then(response => {
                LOG(this.label, 'UPDATED:', response.data, '');
                resolve(response.data);
            });
        });
    }

    closeModal() {
        this.removeModal();
        this.parent.show();
    }

    removeModal() {
        delete this.modal;
    }

    downloadImage() {
        const inputImageUrl = this.modal.target.querySelector('[data-input="image_url"]');
        const imagesElement = this.modal.target.querySelector('[data-artist-images]');
        const postData = {
            imageUrl: inputImageUrl.value
        }

        return this.fetch(`${this.app.urlBase}/artist/${this.id}/image/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
            .then(response => {
                LOG(this.label, 'IMAGE ADDED:', response.data);
                return Promise.resolve(response.data);
            })
            .then(imageData => {
                if (!imageData)
                    return Promise.resolve(false);

                inputImageUrl.value = '';

                // @TODO this is dirty ... use a template
                this.modal.options.images.push(imageData);
                imagesElement.append(toDOM(`<div data-artist-image="${imageData.id}" class="artist--images__image" style="background-image: url(${APP.mediaBaseUrl}/${imageData.hash}.jpg)"></div>`));
                imagesElement.querySelector(`[data-artist-image="${imageData.id}"]`).onclick = () => this.setPoster(imageData.id);
            });
    }

    setPoster(imageId) {
        LOG(this.label, 'USE POSTER IMAGE', imageId);
        this.posterImageId = imageId;

        const image = this.modal.options.images.filter(i => i.id === parseInt(imageId))[0];
        const posterImage = this.modal.target.querySelector('[data-artist-poster-image]');
        posterImage.removeAttribute('style');
        const url = encodeURI(`${APP.mediaBaseUrl}/${image.hash}.jpg`);
        posterImage.setAttribute('style', `background-image:url(${url})`);

        LOG('>>>>>', url, posterImage.style.backgroundImage, posterImage,'');

        /*const postData = {
            id: imageId
        }

        return this.fetch(`${this.app.urlBase}/artist/${this.id}/posterimage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(response => {
            LOG(this.label, 'UPDATED:', response.data, '');
            return Promise.resolve(response.data);
        });*/
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
