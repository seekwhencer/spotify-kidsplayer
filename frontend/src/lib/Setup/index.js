import Tab from '../Tab.js';
import LayoutTemplate from "./Templates/layout.html";

import Form from './Form.js';

export default class Setup extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP'
        this.tab = 'setup';

        this.target = this.toDOM(LayoutTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        this.on('property', (prop, value) => this.setProp(prop, value));

        // the form data
        this.dataSource = {};
        this.data = new Proxy(this.dataSource, {
            get: (target, prop, receiver) => {
                return target[prop];
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

        this.form = new Form(this);
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

}
