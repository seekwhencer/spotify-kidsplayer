export default class Tab extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
    }

    show() {
        LOG(this.label, this.tab);
    }
}
