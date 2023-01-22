import {EventEmitter} from 'events';

export default class Module {

    constructor(parent, options) {
        this.name = 'module';
        this.label = 'MODULE';
        this.ready = false;
        this.options = options;
        this.defaults = {};
        this.event = new EventEmitter();
        this.items = [];

        parent ? this.parent = parent : null;
        this.parent ? this.parent.app ? this.app = this.parent.app : null : null;
    }

    on() {
        this.event.on.apply(this.event, Array.from(arguments));
    }

    emit() {
        this.event.emit.apply(this.event, Array.from(arguments));
    }

    get(match, not) {
        return this.items.filter(item => {
            if (item.id === match) {
                if (not === item.id) {
                    return false;
                }
                return true;
            }
        })[0];
    }

    getF(field, match, not) {
        return this.items.filter(item => {
            if (item[field] === match) {
                if (not === item[field]) {
                    return false;
                }
                return true;
            }
        })[0];
    }

    toDOM(string) {
        return new DOMParser().parseFromString(string, "text/html").documentElement.querySelector('body').firstChild;
    }

    fetch(url, requestOptions) {
        !requestOptions ? requestOptions = {
            method: 'GET'
        } : null;

        return fetch(url, requestOptions)
            .then(response => {
                if (!response.ok)
                    return Promise.reject(response.statusText);

                return response.json();
            });
    }

}
