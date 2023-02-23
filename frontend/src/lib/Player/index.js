import LayoutTemplate from './Templates/layout.html';

export default class Player extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'PLAYER';
        LOG(this.label, 'INIT');

        this.state = false;

        this.track = false;
        this.artist = false;
        this.album = false;
        this.tracks = false;

        this.target = toDOM(LayoutTemplate({
            scope: {
                icon: {
                    play: false,
                    pause: false,
                    next: false,
                    prev: false
                }
            }
        }));

        this.parent.target.append(this.target);

        this.targets = {
            player: this.target.querySelector('[data-player]'),
            trackName: this.target.querySelector('[data-player-track-name]'),
            albumName: this.target.querySelector('[data-player-album-name]'),
            albumImage: this.target.querySelector('[data-player-album-image]'),
            artistName: this.target.querySelector('[data-player-artist-name]'),
            artistImage: this.target.querySelector('[data-player-artist-image]'),
            seek: this.target.querySelector('[data-player-seek]'),
            progress: this.target.querySelector('[data-player-seek-progress]'),
            handle: this.target.querySelector('[data-player-seek-handle]'),
            play: this.target.querySelector('[data-player-seek-play]'),
            pause: this.target.querySelector('[data-player-seek-pause]'),
        };

        this.statsCycle = setInterval(() => this.getState(), 1000);

        /*
         * REGISTER EVENTS
         */
        this.on('state', () => {
            LOG(this.label, 'GOT STATE', this.state, '');
        });
        this.on('track', () => {
            LOG(this.label, 'GOT TRACK', this.track, '');
        });
        this.on('album', () => {
            LOG(this.label, 'GOT ALBUM', this.album, '');
        });
        this.on('artist', () => {
            LOG(this.label, 'GOT ARTIST', this.artist, '');
        });
        this.on('tracks', () => {
            LOG(this.label, 'GOT TRACKS', this.tracks, '');
        });
    }

    play(trackId) {
        LOG(this.label, 'PLAY TRACK', trackId);

        let track;
        return this.fetch(`${this.app.urlBase}/track/${trackId}`)
            .then(res => {
                if (!res)
                    return Promise.resolve(false);

                track = res.data;
                return this.fetch(`${this.app.urlBase}/player/play/track/${track.id}`);
            })
            .then(() => Promise.resolve(track));
        
    }

    getState() {
        return this.fetch(`${this.app.urlBase}/player/state`)
            .then(res => {
                this.state = res.data.state;
                this.track = res.data.track;
                this.album = res.data.album;
                this.artist = res.data.artist;
                this.tracks = res.data.tracks;
                return Promise.resolve(this.state);
            });
    }

    /**
     *  GETTER / SETTER
     */

    get state() {
        return this._state;
    }

    set state(val) {
        if (JSON.stringify(this.state) === JSON.stringify(val))
            return;

        this._state = val;
        this.emit('state');
    }

    get track() {
        return this._track;
    }

    set track(val) {
        if (JSON.stringify(this.track) === JSON.stringify(val))
            return;

        this._track = val;
        this.emit('track');
    }

    get album() {
        return this._album;
    }

    set album(val) {
        if (JSON.stringify(this.album) === JSON.stringify(val))
            return;

        this._album = val;
        this.emit('album');
    }

    get artist() {
        return this._artist;
    }

    set artist(val) {
        if (JSON.stringify(this.artist) === JSON.stringify(val))
            return;

        this._artist = val;
        this.emit('artist');
    }

    get tracks() {
        return this._tracks;
    }

    set tracks(val) {
        if (JSON.stringify(this.tracks) === JSON.stringify(val))
            return;

        this._tracks = val;
        this.emit('tracks');
    }


}
