import ModalEditBody from "./Templates/album-edit.html";
import Modal from "../Modal/index.js";

export default class AlbumModalEdit extends MODULECLASS {
    constructor(parent, options) {
        super(parent);

        this.label = 'ARTIST ALBUM MODAL EDIT'
        this.album = parent;

        options ? this.options = options : this.options = {};
    }

    edit() {
        LOG(this.label, 'EDIT', this.album.id, this.album.data.name);

        return this.fetch(`${this.app.urlBase}/album/${this.album.id}`).then(response => {

            const modalBody = toDOM(ModalEditBody({
                scope: response.data
            }));

            this.modal = new Modal(this, {
                ...response.data,

                title: _T("Edit album"),

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
        LOG(this.label, 'OPENED FINALLY');

        // stuff when the modal is open
        const inputElement = this.modal.target.querySelector('[data-input="name"]');
        inputElement.focus();
        inputElement.onkeyup = () => `${inputElement.value}` === `${this.data.name}` ? inputElement.classList.remove('update') : inputElement.classList.add('update');

        // image url button
        const downloadButton = this.modal.target.querySelector('[data-button="download"]');
        downloadButton.onclick = () => this.downloadImage();

        // images
        const imageElements = this.modal.target.querySelectorAll('[data-album-image]');
        imageElements.forEach(image => image.onclick = () => this.setPoster(image.dataset.albumImage));
    }

    submitModal() {
        return new Promise((resolve, reject) => {
            LOG(this.label, 'SUBMIT');

            const inputName = this.modal.target.querySelector('[data-input="name"]');
            const postData = {
                name: inputName.value,
                posterImageId: this.posterImageId
            }

            return this.fetch(`${this.app.urlBase}/album/update/${this.album.id}`, {
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
        this.app.tabs.artist.refresh();
    }

    removeModal() {
        delete this.modal;
    }

    downloadImage() {
        const inputImageUrl = this.modal.target.querySelector('[data-input="image_url"]');
        const imagesElement = this.modal.target.querySelector('[data-album-images]');
        const postData = {
            imageUrl: inputImageUrl.value
        }

        return this.fetch(`${this.app.urlBase}/album/${this.album.id}/image/add`, {
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
                imagesElement.append(toDOM(`<div data-album-image="${imageData.id}" class="album--images__image" style="background-image: url(${APP.mediaBaseUrl}/${imageData.hash}.jpg)"></div>`));
                imagesElement.querySelector(`[data-album-image="${imageData.id}"]`).onclick = () => this.setPoster(imageData.id);
            });
    }

    setPoster(imageId) {
        LOG(this.label, 'USE POSTER IMAGE', imageId);
        this.posterImageId = imageId;

        const image = this.modal.options.images.filter(i => i.id === parseInt(imageId))[0];
        const posterImage = this.modal.target.querySelector('[data-album-poster-image]');
        posterImage.removeAttribute('style');
        const url = encodeURI(`${APP.mediaBaseUrl}/${image.hash}.jpg`);
        posterImage.setAttribute('style', `background-image:url(${url})`);
    }

}
