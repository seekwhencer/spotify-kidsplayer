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

        // polling play state from server
        this.statsCycle = setInterval(() => this.getState(), 1000);

        /*
         * REGISTER EVENTS
         */
        this.on('state', () => {
            this.progressPercent = 100 / this.track.duration_ms * this.state.progress_ms;
            this.progress = this.state.progress_ms;
            //LOG(this.label, 'GOT STATE', this.state);
        });

        this.on('progress', () => {
            //LOG(this.label, 'GOT PROGRESS', this.progress, this.progressPercent);
            this.drawProgress();
            this.nextAlbum();
        });

        this.on('track', () => {
            LOG(this.label, 'GOT TRACK', this.track, '');
            this.drawTrack();
        });

        this.on('album', () => {
            LOG(this.label, 'GOT ALBUM', this.album, '');
            this.drawAlbum();
        });

        this.on('artist', () => {
            LOG(this.label, 'GOT ARTIST', this.artist, '');
            this.drawArtist();
        });

        this.on('tracks', () => {
            LOG(this.label, 'GOT TRACKS', this.tracks, '');
            this.drawTracks();
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
                this.track = res.data.track;
                this.album = res.data.album;
                this.artist = res.data.artist;
                this.tracks = res.data.tracks;
                this.state = res.data.state;
                return Promise.resolve(this.state);
            });
    }

    drawProgress() {
        this.targets.handle.style.left = `${this.progressPercent}%`;
        this.targets.progress.style.width = `${this.progressPercent}%`;
        this.highlightAlbumTrack();
    }

    drawTrack() {
        this.targets.trackName.replaceChildren(this.track.name);
        this.highlightAlbumTrack();
    }

    drawAlbum() {
        this.targets.albumName.replaceChildren(this.album.name);
        this.targets.albumImage.src = `${APP.mediaBaseUrl}/${this.album.image}.jpg`;
        this.targets.albumImage.onclick = () => this.app.tabs.album.show(this.album.id);
    }

    drawArtist() {
        this.targets.artistName.replaceChildren(this.artist.name);
        this.targets.artistImage.src = `${APP.mediaBaseUrl}/${this.artist.image}.jpg`;
        this.targets.artistImage.onclick = () => this.app.tabs.artist.show(this.artist.id);
    }

    drawTracks() {

    }

    highlightAlbumTrack() {
        if (!this.app.tabs.album.albumTracks)
            return;

        const track = this.app.tabs.album.albumTracks.tracks.filter(t => t.id === this.track.id)[0];
        if (!track)
            return;

        track.highlightPlaying(true);
    }

    playAlbum(albumId) {
        LOG(this.label, 'PLAY ALBUM', albumId);
        return this
            .fetch(`${this.app.urlBase}/album/${albumId}`)
            .then(data => {
                LOG(this.label, 'PLAY GET ALBUM', albumId);
                return this.play(data.data.tracks[0].id);
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
        this.emit('track'); // equals a track change
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

    get progress() {
        return this._progress;
    }

    set progress(val) {
        if (this.progress === val)
            return;

        this._progress = val;
        this.emit('progress');
    }


}
