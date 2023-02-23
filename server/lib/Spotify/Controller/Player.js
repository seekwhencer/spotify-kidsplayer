import SpotifyController from './SpotifyController.js';

export default class SpotifyPlayer extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY PLAYER';
        LOG(this.label, 'INIT');

        this.is_playing = false;
        this.shuffle_state = false;
        this.repeat_state = false;
        this.progress_ms = false;

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
            state: {
                is_playing: this.is_playing,
                shuffle_state: this.shuffle_state,
                repeat_state: this.repeat_state,
                progress_ms: this.progress_ms,
                spotify_id: this.track.spotify_id
            },
            track: this.track,
            album: this.album,
            artist: this.artist,
            tracks: this.tracks
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

        return this.spotify.storage.track.getBySpotifyId(this.data.item.id)
            .then(track => {
                if (!track)
                    return Promise.resolve(false);

                this.track = track;
                return this.spotify.album.getOne(track.album_id);
            })
            .then(album => {
                if (!album)
                    return Promise.resolve(false);

                this.album = album;
                this.artist = album.artist;
                this.tracks = album.tracks;

                delete this.album.artist;
                delete this.album.tracks;

                LOG(this.label, 'GOT TRACK AND ALBUM');
                return Promise.resolve();
            });
    }

    device() {
        return this.spotify.getDevices().then(() => Promise.resolve(this.spotify.availableDevices));
    }

    shuffle() {
        return this.spotify.shuffle();
    }

    get data() {
        return this._data;
    }

    set data(val) {
        this.shuffle_state = val.shuffle_state;
        this.repeat_state = val.repeat_state;
        this.progress_ms = val.progress_ms;
        this.is_playing = val.is_playing;

        if (val === false)
            return;

        if (!val.item)
            return;

        if (!val.item.id)
            return;

        if (this.data)
            if (this.data.item)
                if (this.data.item.id === val.item.id)
                    return;

        this._data = val;
        this.emit('change');
    }

}