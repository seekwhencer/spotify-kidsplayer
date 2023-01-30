import SpotifyController from './SpotifyController.js';

export default class SpotifyAlbum extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ALBUM';
        LOG(this.label, 'INIT');
        this.model = this.storage.artist;
    }

    add(albumURI) {
        const spotifyId = this.wrapIdFromURI(albumURI);

        return this.model
            .getBySpotifyId(spotifyId)
            .then(data => {
                if (data.length > 0) {
                    LOG(this.label, 'ALBUM EXISTS', spotifyId);
                    return Promise.resolve(false);
                }
                return this.getById(spotifyId);
            })
            .then(album => {
                if (!album)
                    return Promise.resolve(false);

                LOG(this.label, 'ALBUM FETCHED', album, '');

                return this.model.create({
                    name: album.name,
                    spotify_id: album.id,
                    dt_create: nowDateTime()
                }, artist.images);
            });
    }

    update(artistId, params) {
        return this.model
            .getById(artistId)
            .then(artist => {
                if (!artist)
                    return Promise.resolve(false);

                return this.model.update(artistId,{
                    name: artist.name,
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
}