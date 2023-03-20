import Tab from '../Tab.js';
import LayoutTemplate from "./Templates/layout.html";

import SetupNavi from './Navi.js';
import SetupForm from './Form.js';

export default class Setup extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP'
        this.tab = 'setup';

        this.target = this.toDOM(LayoutTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.targets = {
            navi: this.target.querySelector('[data-setup-navi]'),
            form: this.target.querySelector('[data-setup-form]'),
        }

        this.on('data', () => this.draw());
        this.on('property', (prop, value) => this.setProp(prop, value));

        // all (!) setup properties
        this.dataSource = {};
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop] || this.dataSource[prop];
            },
            set: (target, prop, value) => {
                if (target[prop] === value)
                    return true;

                LOG(this.label, 'PROP SET', prop, value);
                target[prop] = value;
                this.emit('property', prop, value);
                return true;
            }
        });
    }

    show() {
        this.app.navigation.disableFilter();
        this.getData();
        super.show();
    }

    getData() {
        return this.fetch(`${this.app.urlBase}/setup`)
            .then(raw => {
                this.dataSource = raw.data;
                this.allowedProps = raw.allowedProps; // only this props can be set. props from config file

                this.emit('data');
                return Promise.resolve();
            });
    }

    setProp(prop, value) {
        const data = {};
        data[prop] = value;
        return this.fetch(`${this.app.urlBase}/setup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            LOG(this.label, 'SUBMIT SETUP PROP:', response.data, '');
        });
    }

    draw() {
        this.groups = this.flattenGroups();
        this.navi = new SetupNavi(this)
        this.form = new SetupForm(this);
    }

    flattenGroups() {
        const arr = [];
        this.allowedProps.forEach(prop => {
            const split = prop.split('_');
            let group;
            split.length === 1 ? group = 'GLOBAL' : group = split[0];
            !arr.includes(group) ? arr.push(group) : null;
        });
        return arr;
    }

    selectGroup(group) {
        LOG(this.label, 'SELECT GROUP', group);
        this.form.show(group);
    }

    showSummary() {
        this.form.summary();
    }

}
