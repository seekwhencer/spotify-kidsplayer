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
        let artistSpotify, artistDB, albumsSpotify, albumsDB;

        return this.model
            .getBySpotifyId(spotifyId)
            .then(data => { // returns the artist data from spotify
                artistDB = data;

                if (!artistDB) {
                    return this.getById(spotifyId);
                }

                LOG(this.label, 'EXISTS IN DB:', artistDB.spotify_id);

                return Promise.resolve();
            })
            .then(artist => { // returns the inserted or existing id
                if (!artist)
                    return Promise.resolve(artistDB);

                artistSpotify = artist;

                return this.model.create({
                    name: artistSpotify.name,
                    spotify_id: artistSpotify.id,
                    dt_create: nowDateTime()
                }).then(artistWritten => {
                    artistDB = artistWritten;

                    if (artistSpotify.images) {
                        return this.model.addImages(artistDB.id, artistSpotify.images);
                    }
                    return Promise.resolve(artistDB);

                }).then(() => {
                    return Promise.resolve(artistDB);
                });
            })
            .then(artist => { // this is the artist from the database
                artistDB = artist;
                return this.getAlbums(artistDB);
            })
            .then(albums => {
                return Promise.resolve(albums); // the end
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

    // ---------------

    get album() {
        return this.spotify.album;
    }

    set album(val) {

    }
}