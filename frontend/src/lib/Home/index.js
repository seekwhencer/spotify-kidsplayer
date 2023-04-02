import Tab from '../Tab.js';
import LayoutTemplate from "./Templates/layout.html";

export default class Home extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'HOME'
        this.tab = 'home';

        this.target = this.toDOM(LayoutTemplate({
            scope: {
                icons: this.app.icons
            }
        }));
        this.parent.target.append(this.target);

        this.buttonElements = this.target.querySelectorAll('[data-button]');
        this.buttonElements.forEach(button => button.onclick = () => this.select(button));

    }

    show() {
        this.app.navigation.disableFilter();
        super.show();
    }

    select(button) {
        const type = button.dataset.button;
        this.read(_T(`icon description ${type}`));
    }

    read(text) {
        this.app.speech.speak(text);
    }

}
