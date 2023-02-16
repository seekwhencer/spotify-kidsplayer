import AlbumsTemplate from "./Templates/albums.html";
import Album from './Album.js';

export default class Albums extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUMS'

        this.target = this.toDOM(AlbumsTemplate({
            scope: {}
        }));

        this.filter = {};
        this.albums = [];
        options.albums.forEach(album => this.albums.push(new Album(this, album)));
    }

    toggleFilter(filter) {
        LOG(this.label, 'TOGGLE FILTER', filter);
        this.filter[filter] === true ? this.filter[filter] = false : this.filter[filter] = true;

        this.albums.forEach(album => {
            album.hide();

            if (this.filter.like === true && album.data.is_liked === 1)
                album.show();

            if (this.filter.audiobook === true && album.data.type === 'audiobook')
                album.show();

            if (this.filter.music === true && album.data.type === 'music')
                album.show();

            if (this.filter.podcast === true && album.data.type === 'podcast')
                album.show();


            if (!this.filter.like && !this.filter.audiobook && !this.filter.music && !this.filter.podcast)
                album.show();
        });
        this.app.navigation.draw(this.filter);
    }
}
