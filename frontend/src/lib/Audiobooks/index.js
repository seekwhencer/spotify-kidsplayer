import Tab from '../Tab.js';
import AudiobooksTemplate from "./Templates/audiobooks.html";

export default class Audiobooks extends Tab {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'AUDIOBOOKS'
        this.tab = 'audiobooks';

        this.target = this.toDOM(AudiobooksTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);
    }

}
