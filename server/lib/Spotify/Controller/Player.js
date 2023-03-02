import SpotifyController from './SpotifyController.js';

export default class SpotifyPlayer extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY PLAYER';
        LOG(this.label, 'INIT');

        this.is_playing = false;
        this.progress_ms = false;
        this.shuffle_state = false;
        this.repeat_state = false;

        this.stateCycle = new setInterval(() => this.getState(), 1000);

        this.track = false;
        this.album = false;
        this.artist = false;
        this.tracks = false;

        this.nextAlbum = false;

        this.on('track-change', () => this.completeState());

        this.on('queue-end', () => {
            LOG(this.label, 'QUEUE END');

            this.spotify.album.getNext(this.album.id).then(nextAlbum => {
                LOG(this.label, 'GOT NEXT ALBUM (BY FILTER)', nextAlbum.name, 'TRACK 0:', nextAlbum.tracks[0].name);
                this.nextAlbum = nextAlbum;

                // play the first track of the next album
                this.play(this.nextAlbum.tracks[0].id);

                return Promise.resolve(true);
            });
        });

        this.on('progress', () => {
            //LOG(this.label, 'PROGRESS', this.progress_ms);
        });

        this.on('play', () => {
            LOG(this.label, 'IS PLAYING');
        });

        this.on('stop', () => {
            LOG(this.label, 'IS STOPPED');
            if (this.progress_ms === 0) {
                this.emit('queue-end');
            }
        });


    }

    /**
     * playing a track
     * - get the track from the database
     * - get all tracks from the track album
     * - add all tracks from the track number into the spotify playback queue
     *
     * @param id = database id
     * @returns {Promise}
     */
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
                progress_ms: this.progress_ms,
                shuffle_state: this.shuffle_state,
                repeat_state: this.repeat_state,
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
                data ? this.raw = JSON.parse(data) : this.raw = false;
                return Promise.resolve(data);
            });
    }

    completeState() {
        LOG(this.label, 'TRACK CHANGE COMPLETE STATE');

        return this.spotify.storage.track.getBySpotifyId(this.raw.id)
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

                return Promise.resolve(true);
            });
    }

    device() {
        return this.spotify.getDevices().then(() => Promise.resolve(this.spotify.availableDevices));
    }

    shuffle() {
        return this.spotify.shuffle();
    }

    // --------------------------

    get raw() {
        return this._raw;
    }

    set raw(val) {
        if (val === false)
            return;

        ['progress_ms', 'is_playing', 'shuffle_state', 'repeat_state'].forEach(k => val[k] !== undefined ? this[k] = val[k] : null);

        if (!val.item)
            return;

        if (!val.item.id)
            return;

        if (this.raw)
            if (this.raw.id === val.item.id)
                return;

        this._raw = val.item;
        this.emit('track-change');
    }

    get progress_ms() {
        return this._progress_ms;
    }

    set progress_ms(val) {
        if (this.progress_ms === val)
            return;

        this._progress_ms = val;
        this.emit('progress');
    }

    get is_playing() {
        return this._is_playing;
    }

    set is_playing(val) {
        if (this.is_playing === val)
            return;

        LOG('???', val);
        this._is_playing = val;
        this.is_playing === true ? this.emit('play') : this.is_playing === false ? this.emit('stop') : null;
    }

}