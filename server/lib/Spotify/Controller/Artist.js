import SpotifyController from './SpotifyController.js';

export default class SpotifyArtist extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ARTIST';
        LOG(this.label, 'INIT');
        this.model = this.storage.artist;

        this.albums = [];
    }

    add(artistURI) {
        const spotifyId = this.wrapIdFromURI(artistURI);
        let artistDB, artistSpotify;

        return this.model
            .getBySpotifyId(spotifyId)
            .then(data => {
                artistDB = data;

                if (!artistDB)
                    return this.getById(spotifyId);

                if (Object.values(artistDB).length > 0) {
                    return Promise.resolve();
                }
            })
            .then(artist => {
                if (!artist)
                    return Promise.resolve(artistDB.id);

                artistSpotify = artist;

                return this.model.create({
                    name: artistSpotify.name,
                    spotify_id: artistSpotify.id,
                    dt_create: nowDateTime()
                }, artistSpotify.images);
            })
            .then(artistId => {
                return this.getAlbums(spotifyId);
            })
            .then(() => {
                LOG(this.label,'GOT', this.albums.length, 'ALBUMS');
                return Promise.resolve(this.albums);
            })
    }

    update(artistId, params) {
        return this.model
            .getById(artistId)
            .then(artist => {
                if (!artist)
                    return Promise.resolve(false);

                return this.model.update(artistId, {
                    name: params.name,
                    dt_update: nowDateTime()
                });
            });
    }

    getById(spotifyId) {
        return this.api
            .getArtist(spotifyId)
            .then(data => {
                //..
                return Promise.resolve(data.body);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    getAlbums(spotifyId, limit, offset) {
        limit = limit || 10;
        offset = offset || 0;

        // reset album collection
        this.albums = [];

        LOG(this.label, 'GET ALBUMS');
        return this.getAlbumPage(spotifyId, limit, offset);
    }

    getAlbumPage(spotifyId, limit, offset) {
        return new Promise((resolve, reject) => {

            this.api
                .getArtistAlbums(spotifyId, {
                    limit: limit,
                    offset: offset,
                    market: 'DE'
                })
                .then((data, err) => {
                    LOG(this.label, 'ALBUM INFORMATION', data.body.items.length, limit, offset);
                    this.albums = [...this.albums, ...data.body.items];
                    offset = offset + limit;

                    if (offset > data.body.total) {
                        resolve(); // exit the recursion
                    } else {
                        resolve(this.getAlbumPage(spotifyId, limit, offset));
                    }
                });
        });
    }
}