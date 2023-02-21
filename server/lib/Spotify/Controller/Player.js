import SpotifyController from './SpotifyController.js';

export default class SpotifyTrack extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY PLAYER';
        LOG(this.label, 'INIT');
    }

    play(id) {

        return this.spotify.storage.track.getOne(id)
            .then(track => {
                if (!track)
                    return Promise.resolve(false);

                return this.spotify.storage.track.getAllBy('album_id', track.album_id);
            })
            .then(tracks => {
                if (!tracks)
                    return Promise.resolve(false);

                if (tracks.length === 0)
                    return Promise.resolve(false);

                const requestData = {
                    uris: tracks.map(track => `spotify:track:${track.spotify_id}`)
                };

                return this.request(requestData, 'PUT', 'me/player/play');
            })
            .then(data => {
                LOG(this.label, 'PLAYING QUEUE', data, '');
                return Promise.resolve(data);
            });
    }

    pause() {
        return this
            .request(false, 'PUT', 'me/player/pause')
            .then(data => {
                LOG(this.label, 'PAUSE', data, '');
                return Promise.resolve(data);
            });
    }

    resume() {
        return this
            .request({}, 'PUT', 'me/player/play')
            .then(data => {
                LOG(this.label, 'PLAY', data, '');
                return Promise.resolve(data);
            });
    }

    stop() {
        return this.pause();
    }


}