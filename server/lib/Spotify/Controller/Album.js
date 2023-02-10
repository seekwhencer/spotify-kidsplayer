import SpotifyController from './SpotifyController.js';

export default class SpotifyAlbum extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ALBUM';
        LOG(this.label, 'INIT');

        this.model = this.storage.album;
    }

    addBulk(items) {
        LOG(this.label, 'ADD BULK', items.length);
        return this.addWalk(items);
    }

    addWalk(items, index) {
        !index ? index = 0 : null;

        return new Promise((resolve, reject) => {
            this
                .add(items[index])
                .then(() => {
                    if (index >= items.length - 1) {
                        resolve(items); // exit the recursion
                    } else {
                        resolve(this.addWalk(items, index + 1));
                    }
                });
        });
    }

    add(albumData) {
        let albumDB, albumSpotify;
        const artist_id = albumData.artist_id;

        LOG(this.label, 'ADD', albumData.name, albumData.id);

        return this.model
            .getBySpotifyId(albumData.id)
            // get spotify data
            .then(data => {
                albumDB = data;

                if (!albumDB)
                    return this.getById(albumData.id);

                LOG(this.label, 'EXISTS IN DB:', albumDB.spotify_id);
                return Promise.resolve(false);
            })
            // save it
            .then(album => {
                if (!album)
                    return Promise.resolve(albumDB);

                albumSpotify = album;

                const data = {
                    name: albumSpotify.name,
                    spotify_id: albumSpotify.id,
                    artist_id: artist_id,
                    type: albumSpotify.type,
                    total_tracks: albumSpotify.total_tracks,
                    dt_create: nowDateTime()
                };
                return this.model.create(data);
            })
            // images
            .then(album => {
                albumDB = album;

                if (!albumSpotify)
                    return Promise.resolve();

                if (albumSpotify.images) {
                    return this.model.addImages(albumDB.id, albumSpotify.images);
                }
                return Promise.resolve();
            })
            // tracks
            .then(() => {
                return this.getTracks(albumDB);
            })
            .then(tracks => {
                albumDB.tracks = tracks;

                LOG(this.label, 'GOT TRACKS', tracks.length);
                return Promise.resolve(albumDB);
            });
    }

    update(albumId, params) {
        return this.model
            .getById(albumId)
            .then(album => {
                if (!album)
                    return Promise.resolve(false);

                return this.model.update(albumId, {
                    name: params.name,
                    dt_update: nowDateTime()
                });
            });
    }

    getById(spotifyId) {
        return this.api
            .getAlbum(spotifyId)
            .then(data => {
                //..
                return Promise.resolve(data.body);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    getByArtist(artist, limit, offset) {
        limit = limit || 10;
        offset = offset || 0;

        return this
            .getByArtistPage(artist.spotify_id, limit, offset)
            .then(data => {
                return data.map(i => ({
                    ...i,
                    ...{artist_id: artist.id}
                }));
            })
            .then(albums => {
                LOG(this.label, 'GOT', albums.length, 'ALBUMS');
                return this.addBulk(albums);
            });
    }

    getByArtistPage(spotifyId, limit, offset, items) {
        !items ? items = [] : null;

        return new Promise((resolve, reject) => {
            this.api
                .getArtistAlbums(spotifyId, {
                    limit: limit,
                    offset: offset,
                    market: 'DE'
                })
                .then((data, err) => {
                    LOG(this.label, 'ALBUM INFORMATION', data.body.items.length, limit, offset);
                    items = [...items, ...data.body.items];
                    offset = offset + limit;

                    if (offset > data.body.total) {
                        resolve(items); // exit the recursion
                    } else {
                        resolve(this.getByArtistPage(spotifyId, limit, offset, items));
                    }
                })
                .catch(e => {
                    ERROR(e);
                });
        });
    }

    getTracks(album, limit, offset) {
        return this.track.getByAlbum(album, limit, offset);
    }

    getByArtistId(id) {
        return this.model.getAllBy('artist_id', id);
    }

    // ---------------

    get album() {
        return this.spotify.album;
    }

    set album(val) {

    }

    get track() {
        return this.spotify.track;
    }

    set track(val) {

    }
}