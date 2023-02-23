export default class Player extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'PLAYER';
        LOG(this.label, 'INIT');

        this.track = false;
        this.album = false;
        this.artist = false;

    }

    play(trackId) {
        LOG(this.label, 'PLAY TRACK', trackId);

        return this.fetch(`${this.app.urlBase}/track/${trackId}`)
            .then(res => {
                this.track = res.data;
                LOG(this.label, 'GOT TRACK', this.track, '');
                return this.fetch(`${this.app.urlBase}/album/${this.track.album_id}`);
            })
            .then(res => {
                this.album = res.data;
                this.artist = this.album.artist;
                LOG(this.label, 'GOT ALBUM', this.album, '');
                return this.fetch(`${this.app.urlBase}/player/play/track/${trackId}`);
            })
            .then(voila => {
                LOG(this.label, 'VOILA', voila, '');
                return Promise.resolve(this.track);
            });
    }


}
