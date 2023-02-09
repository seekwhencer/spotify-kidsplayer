import NavigationTemplate from './Templates/navigation.html';

export default class Navigation extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'NAV';
        LOG(this.label, 'INIT');

        this.target = this.toDOM(NavigationTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.addBehavior();
        this.on('tab', tab => this.app.emit('tab', tab));
    }

    addBehavior() {
        this.menu = this.target.querySelectorAll('[data-navigation]');
        this.menu.forEach(button => button.onclick = () => {
            button.tab = button.getAttribute('data-navigation');
            this.emit('tab', button.tab);
        });
    }
}
