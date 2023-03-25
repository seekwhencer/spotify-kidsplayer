import LayoutTemplate from './Templates/layout.html';

export default class Background extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'BACKGROUND';
        LOG(this.label, 'INIT');

        this.target = toDOM(LayoutTemplate({
            scope: {}
        }));

        this.parent.target.append(this.target);
    }

    set(url) {
        url = encodeURI(url);
        this.target.removeAttribute('style');
        this.target.setAttribute('style', `background-image:url(${url})`);
    }

    remove() {
        this.target.removeAttribute('style');
    }
}
