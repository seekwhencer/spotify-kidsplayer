import NavigationTemplate from './Templates/navigation.html';

export default class Navigation extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'NAV';
        LOG(this.label, 'INIT');


        this.target = this.toDOM(NavigationTemplate({
            scope: {
                icons: {
                    home: this.app.icons.home(),
                    options: this.app.icons.options(),
                    user: this.app.icons.user(),
                    book: this.app.icons.book(),
                    music: this.app.icons.music(),
                    podcast: this.app.icons.podcast(),
                    like: this.app.icons.heart(),
                },
            }
        }));
        this.parent.target.append(this.target);

        this.addBehavior();

        this.on('tab', tab => {
            this.app.emit('tab', tab);
        });
    }

    addBehavior() {
        this.menu = this.target.querySelectorAll('[data-navigation]');
        this.menu.forEach(button => button.onclick = () => this.emit('tab', button.getAttribute('data-navigation')));
    }

    select(tab) {
        this.menu.forEach(b => b.classList.remove('active'));
        const target = this.target.querySelector(`[data-navigation=${tab}]`);
        target ? target.classList.toggle('active') : null;
    }
}
