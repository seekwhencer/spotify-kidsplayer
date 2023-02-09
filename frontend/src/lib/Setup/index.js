import Tab from '../Tab.js';
import SetupTemplate from "./Templates/setup.html";

export default class Setup extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP'
        this.tab = 'setup';

        this.target = this.toDOM(SetupTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
    }

}
