import LockTemplate from "./Templates/Lock.html";

export default class Lock extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'SETUP LOCK';

        this.lockTimeout = false;

        this.target = this.toDOM(LockTemplate({
            scope: {
                pin: this.parent.data.UI_PIN
            }
        }));

        this.inputElement = this.target.querySelector('input');
        this.inputElement.onkeyup = () => this.check();

        this.parent.targets.lock.replaceChildren(this.target);
    }

    check() {
        if (`${this.parent.data.UI_PIN}` === `${this.inputElement.value}`) {
            this.unlock();
        }
    }

    lock() {
        this.parent.parentMode = false;
        this.parent.targets.lock.style.display = 'block';
        this.parent.targets.navi.style.display = 'none';
        this.parent.targets.form.style.display = 'none';
        this.parent.draw();
    }

    unlock() {
        this.parent.parentMode = true;
        this.parent.targets.lock.style.display = 'none';
        this.parent.targets.navi.style.display = 'block';
        this.parent.targets.form.style.display = 'block';
        this.parent.draw();
        this.setLockTimeout();
    }

    setLockTimeout() {
        const duration = this.parent.data.UI_PARENT_TIMEOUT * 60 * 1000; // minutes
        LOG(this.label, 'START LOCK TIMEOUT', duration);
        this.lockTimeout ? clearTimeout(this.lockTimeout) : null;
        this.lockTimeout = setTimeout(() => this.lock(), duration);
    }

}
