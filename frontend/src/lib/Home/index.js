import Tab from '../Tab.js';
import HomeTemplate from "./Templates/home.html";

export default class Home extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'HOME'
        this.tab = 'home';

        this.target = this.toDOM(HomeTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
    }

    show() {
        this.app.navigation.disableFilter();
        super.show();
    }

}
