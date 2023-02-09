export default class Tab extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
    }

    show() {
        LOG(this.label, 'SHOW TAB', this.tab);
        this.app.navigation.select(this.tab);

        // hide all tabs
        Object.keys(this.app.tabs).forEach(tab => this.app.tabs[tab].hide());
        this.target.classList.add('active');
    }

    hide() {
        this.target.classList.remove('active');
    }
}
