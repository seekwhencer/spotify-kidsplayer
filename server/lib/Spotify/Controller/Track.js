import SpotifyController from './SpotifyController.js';

export default class SpotifyTrack extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY TRACK';
        LOG(this.label, 'INIT');

        this.model = this.storage.track;
        this.artist = () => this.spotify.artist;
    }

    getByAlbum(spotifyId, limit, offset) {
        limit = limit || 10;
        offset = offset || 0;

        LOG(this.label, 'GET TRACKS');
        return this.getByAlbumPage(spotifyId, limit, offset);
    }

    getByAlbumPage(spotifyId, limit, offset, items) {
        !items ? items = [] : null;

        return new Promise((resolve, reject) => {
            this.api
                .getAlbumTracks(spotifyId, {
                    limit: limit,
                    offset: offset,
                    market: 'DE'
                })
                .then((data, err) => {
                    LOG(this.label, 'TRACK INFORMATION', data.body.items.length, limit, offset);
                    items = [...items, ...data.body.items];
                    offset = offset + limit;

                    if (offset > data.body.total) {
                        resolve(items); // exit the recursion
                    } else {
                        resolve(this.getByAlbumPage(spotifyId, limit, offset, items));
                    }
                })
                .catch(e => {
                    ERROR(e);
                });
        });
    }
}