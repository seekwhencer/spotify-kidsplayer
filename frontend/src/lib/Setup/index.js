import Tab from '../Tab.js';
import LayoutTemplate from "./Templates/layout.html";

export default class Setup extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP'
        this.tab = 'setup';

        this.target = this.toDOM(LayoutTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
    }

    show() {
        this.app.navigation.disableFilter();
        super.show();
    }

}
