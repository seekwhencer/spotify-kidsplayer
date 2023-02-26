import AlbumsTemplate from "./Templates/albums.html";
import Album from './Album.js';
import AlbumsViewMode from './AlbumsViewMode.js';

export default class Albums extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUMS';
        this.artist = parent;

        this.target = this.toDOM(AlbumsTemplate({
            scope: {}
        }));

        this.viewModeElement = this.target[0];
        this.listElement = this.target[1];

        this.filter = {};
        this.albums = [];
        options.albums.forEach(album => this.albums.push(new Album(this, album)));

        this.viewMode = new AlbumsViewMode(this, {});

    }

    toggleFilter(filter) {
        LOG(this.label, 'TOGGLE FILTER', filter);
        this.filter[filter] === true ? this.filter[filter] = false : this.filter[filter] = true;

        this.albums.forEach(album => {
            album.hide();

            if (this.filter.like === true && album.data.is_liked === 1) {

                if (!this.filter.audiobook && !this.filter.music && !this.filter.podcast) {
                    album.show();
                }

                if (this.filter.audiobook === true && album.data.type === 'audiobook')
                    album.show();

                if (this.filter.music === true && album.data.type === 'music')
                    album.show();

                if (this.filter.podcast === true && album.data.type === 'podcast')
                    album.show();

            }

            if (!this.filter.like) {
                if (this.filter.audiobook === true && album.data.type === 'audiobook')
                    album.show();

                if (this.filter.music === true && album.data.type === 'music')
                    album.show();

                if (this.filter.podcast === true && album.data.type === 'podcast')
                    album.show();
            }

            if (!this.filter.like && !this.filter.audiobook && !this.filter.music && !this.filter.podcast)
                album.show();
        });

        this.app.navigation.draw(this.filter);
        this.submitFilter();
    }

    submitFilter() {
        return this.fetch(`${this.app.urlBase}/artist/${this.artist.raw.id}/albums/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.filter)
        }).then(response => {
            LOG(this.label, 'SUBMIT FILTER:', response.data, '');
        });
    }

    setViewMode() {

    }
}
