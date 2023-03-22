import LayoutTemplate from "./Templates/layout.html";

export default class Modal extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'MODAL';

        this.target = this.toDOM(LayoutTemplate({
            scope: {
                ...this.options,
                closeIcon: this.app.icons.close()
            }
        }));

        // to call from outside
        this.target.close = () => this.close();
        this.target.submit = () => this.submit();

        this.bodyElement = this.target.querySelector('[data-modal="body"]');
        this.bodyElement.replaceChildren(this.options.body);

        this.closeButton = this.target.querySelector('[data-button="close"]');
        this.submitButton = this.target.querySelector('[data-button="submit"]');

        this.closeButton.onclick = () => this.close();
        this.submitButton.onclick = () => this.submit();

        if (!this.options.silent)
            this.open();
    }

    open() {
        document.querySelector('body').append(this.target);
        typeof this.options.open === 'function' ? this.options.open() : null;
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
