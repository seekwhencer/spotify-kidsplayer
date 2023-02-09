import NavigationTemplate from './Templates/navigation.html';

export default class Navigation extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.target = this.toDOM(NavigationTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

    }
}
