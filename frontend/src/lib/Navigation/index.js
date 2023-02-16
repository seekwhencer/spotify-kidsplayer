import NavigationTemplate from './Templates/navigation.html';

export default class Navigation extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'NAVIGATION';
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
        this.menu = this.target.querySelectorAll('[data-navigation]');
        this.filter = this.target.querySelectorAll('[data-filter]');

        this.menu.forEach(button => button.onclick = () => this.emit('tab', button.getAttribute('data-navigation')));
        this.filter.forEach(button => button.onclick = () => this.emit('filter', button.getAttribute('data-filter')));

        this.on('tab', tab => {
            this.app.emit('tab', tab);
        });

        this.on('filter', filter => {
            this.app.emit('filter', filter);
        });
    }

    select(tab) {
        this.menu.forEach(b => b.classList.remove('active'));
        const target = this.target.querySelector(`[data-navigation=${tab}]`);
        target ? target.classList.toggle('active') : null;
    }

    enclose(filter) {
        this.filter.filter(button => button.getAttribute('data-filter') === filter);
    }

    clearFilter() {
        LOG(this.label, 'CLEAR FILTER');
        this.filter.forEach(button => button.classList.remove('disabled'));
        this.filter.forEach(button => button.classList.remove('active'));
    }

    disableFilter() {
        LOG(this.label, 'DISABLE FILTER');
        this.filter.forEach(button => {
            button.classList.add('disabled');
            button.classList.remove('active');
        });
    }

    draw(filter) {
        LOG(this.label, 'DRAW FILTER', filter);
        this.filter.forEach(button => {
            const filterName = button.getAttribute('data-filter');
            filter[filterName] === true ? button.classList.add('active') : button.classList.remove('active');
        });
    }


}
