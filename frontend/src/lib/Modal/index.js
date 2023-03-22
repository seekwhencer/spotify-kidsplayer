import LayoutTemplate from "./Templates/layout.html";

export default class Modal extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'MODAL';
        this.open();
    }

    open() {
        this.target = this.toDOM(LayoutTemplate({
            scope: this.options
        }));

        this.target.close = () => this.close();
        this.target.submit = () => this.submit();

        this.closeButton = this.target.querySelector('[data-button="close"]');
        this.submitButton = this.target.querySelector('[data-button="submit"]');

        this.closeButton.onclick = () => this.close();
        this.submitButton.onclick = () => this.submit();

        document.querySelector('body').append(this.target);
    }

    close() {
        this.target.remove();
        typeof this.options.close === 'function' ? this.options.close() : null;
    }

    submit() {
        // this.options.submit must be a promise
        typeof this.options.submit === 'function' ? this.options.submit().then(() => this.close()) : null;
    }
}
