import Tab from '../Tab.js';
import MusicTemplate from "./Templates/music.html";

export default class Artists extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'MUSIC'
        this.tab = 'music';

        this.target = this.toDOM(MusicTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
    }

}
