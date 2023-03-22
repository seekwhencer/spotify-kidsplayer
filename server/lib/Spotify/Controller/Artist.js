import SpotifyController from './SpotifyController.js';

export default class SpotifyArtist extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ARTIST';
        LOG(this.label, 'INIT');
        this.model = this.storage.artist;
    }

    add(artistURI) {
        const spotifyId = this.wrapIdFromURI(artistURI);
        let artistSpotify, artistDB, albumsSpotify, albumsDB;

        LOG(this.label, 'ADD', artistURI);

        return this.model
            .getBySpotifyId(spotifyId)
            .then(data => { // returns the artist data from spotify
                artistDB = data;

                if (!artistDB) {
                    return this.getById(spotifyId);
                }

                LOG(this.label, 'EXISTS IN DB:', artistDB.spotify_id);

                return Promise.resolve(false);
            })
            .then(artist => { // returns the inserted or existing id
                if (!artist)
                    return Promise.resolve(artistDB);

                artistSpotify = artist;

                const data = {
                    name: artistSpotify.name,
                    spotify_id: artistSpotify.id,
                    dt_create: nowDateTime()
                };

                return this.model.create(data);
            })
            .then(artist => {
                artistDB = artist;

                if (!artistSpotify)
                    return Promise.resolve();

                if (artistSpotify.images) {
                    return this.model.addImages(artistDB.id, artistSpotify.images);
                }
                return Promise.resolve();
            })
            .then(() => {
                return this.getAlbums(artistDB);
            })
            .then(albums => {
                artistDB.albums = albums;

                return Promise.resolve(artistDB); // the end
            });

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

    getAlbums(artist, limit, offset) {
        return this.album.getByArtist(artist, limit, offset);
    }

    getAll() {
        return this.model.getAll();
    }

    getOne(id) {
        let artist;
        return this.model.getOne(id)
            .then(data => {
                artist = data;
                return this.album.getByArtistId(id);
            })
            .then(albums => {
                artist.albums = albums;
                return Promise.resolve(artist);
            });
    }

    toggleHidden(id) {
        return this.model.getOne(id)
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                return this.model.update(id, {
                    is_hidden: !data.is_hidden,
                    dt_update: nowDateTime()
                });
            }).then(insert => {
                return this.model.getOne(id)
            });
    }

    // ---------------

    get album() {
        return this.spotify.album;
    }

    set album(val) {

    }
}