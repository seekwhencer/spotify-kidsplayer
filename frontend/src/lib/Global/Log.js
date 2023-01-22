export default class Log {
    constructor() {
        window.GALLERY_LOG = console.log;
        console.log = this.log;
    }

    log() {
        if (!window.OPTIONS)
            return;

        if (!window.OPTIONS.debug)
            return;

        window.GALLERY_LOG.apply(this, arguments);
    }
}
new Log();
