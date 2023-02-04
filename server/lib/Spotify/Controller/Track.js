import SpotifyController from './SpotifyController.js';

export default class SpotifyTrack extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY TRACK';
        LOG(this.label, 'INIT');

        this.model = this.storage.track;
    }

    getByAlbum(album, limit, offset) {
        limit = limit || 10;
        offset = offset || 0;

        LOG(this.label, 'GET TRACKS', album.spotify_id, album.name);

        return this.getByAlbumPage(album.spotify_id, limit, offset)
            .then(tracks => {
                tracks = tracks.map(i => ({...i, ...{spotify_id: i.id, album_id: album.id}}));
                return this.addBulk(tracks);
            });
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

    add(trackData) {
        LOG('>>>> ADD TRACK', trackData.name);
        return this.model
            .getBySpotifyId(trackData.id)
            .then(track => {

                if (track) {
                    LOG(this.label, 'EXISTS IN DB:', track.spotify_id, track.name);
                    return Promise.resolve(track);
                }
                const data = {
                    name: trackData.name,
                    spotify_id: trackData.id,
                    album_id: trackData.album_id,
                    track_number: trackData.track_number,
                    duration_ms: trackData.duration_ms,
                    type: trackData.type,
                    dt_create: nowDateTime()
                };

                return this.model.create(data);

            });

    }

    get artist() {
        return this.spotify.album;
    }

    set artist(val) {

    }

    get album() {
        return this.spotify.album;
    }

    set album(val) {

    }
}