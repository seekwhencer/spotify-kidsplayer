import SpotifyController from './SpotifyController.js';

export default class SpotifyPlayer extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY PLAYER';
        LOG(this.label, 'INIT');

        this.stateCycle = new setInterval(() => this.getState(), 1000);

        this.track = false;
        this.album = false;
        this.artist = false;

        this.on('change', () => this.completeState());

    }

    play(id) {

        let trackNumber = 0;

        return this.spotify.storage.track.getOne(id)
            .then(track => {
                if (!track)
                    return Promise.resolve(false);

                trackNumber = track.track_number;
                return this.spotify.storage.track.getAllBy('album_id', track.album_id);
            })
            .then(tracks => {
                if (!tracks)
                    return Promise.resolve(false);

                if (tracks.length === 0)
                    return Promise.resolve(false);

                tracks = tracks.filter(t => t.track_number >= trackNumber);
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
            .request(false, 'PUT', 'me/player/play')
            .then(data => {
                LOG(this.label, 'PLAY', data, '');
                return Promise.resolve(data);
            });
    }

    stop() {
        return this.pause();
    }

    state() {
        return {
            shuffle_state: this.data.shuffle_state,
            repeat_state: this.data.repeat_state,
            progress_ms: this.data.progress_ms,
            spotify_id: this.data.item.id
        };
    }

    getState() {
        return this
            .request(false, 'GET', 'me/player')
            .then(data => {
                data ? this.data = JSON.parse(data) : this.data = false;
                return Promise.resolve(data);
            });
    }

    completeState() {
        LOG(this.label, 'TRACK CHANGE');

    }

    get data() {
        return this._data;
    }

    set data(val) {
        if(this.data)
            if (this.data.item.id === val.item.id)
                return;

        this._data = val;
        this.emit('change');
    }

}