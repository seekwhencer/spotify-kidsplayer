import TrackTemplate from "./Templates/track.html";

export default class Track extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUM TRACK'
        this.tracks = parent;

        this.id = options.id;
        this.name = options.name;
        this.track_number = options.track_number;
        this.spotify_id = options.spotify_id;
        this.duration_ms = options.duration_ms;
        this.durationPercent = 100 / this.tracks.duration * this.duration_ms;

        this.target = this.toDOM(TrackTemplate({
            scope: {
                ...options,
                durationPercent: this.durationPercent,
                icons: {
                    book: this.app.icons.book(),
                    music: this.app.icons.music(),
                    podcast: this.app.icons.podcast(),
                    read: this.app.icons.mouth()
                }
            }
        }));
        parent.target.append(this.target);
        this.target.onclick = () => this.select();
        this.target.style.width = `${this.durationPercent}%`;

        this.buttonRead = this.target.querySelector('[data-track-read]');
        this.buttonPlay = this.target.querySelector('[data-track-play]');

        this.buttonRead.onclick = () => this.read();
        this.buttonPlay.onclick = () => this.play();

    }

    select() {
        LOG(this.label, this.id);
        this.active = true;
        this.tracks.unselectAll(this.id);
        this.highlight();
        this.showDetails();
    }

    showDetails() {
        this.app.tabs.album.showTrackDetails(this);
    }

    highlight() {
        this.target.classList.add('active');
    }

    highlightPlaying(show) {
        show === 'undefined' ? show = true : null;

        if (show === true) {
            this.tracks.highlightPlaying(this.id);
            this.target.classList.add('playing');
        }
        if (show === false) {
            this.target.classList.remove('playing');
        }
    }

    unselect() {
        this.active = false;
        this.target.classList.remove('active');
    }

    read() {
        this.app.speech.speak(this.name);
    }

    play() {
        this.app.player.play(this.id);
    }

}
