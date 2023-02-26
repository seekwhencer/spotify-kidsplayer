import artist from "../Server/routes/Artist.js";

export default class SpotifyFilter extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ALBUM FILTER';
        LOG(this.label, 'INIT');

        this.data = []; // is the filter per artist store
    }

    save(artistId, data) {
        artistId = parseInt(artistId);
        let existingFilter = this.data.filter(f => f.artistId === artistId)[0];
        const newFilter = {
            artistId: artistId,
            ...data,
        };

        if (existingFilter) {
            this.data = this.data.map(f => {
                if (f.artistId !== artistId)
                    return f;

                return newFilter;
            });
        } else {
            this.data.push(newFilter);
        }

        LOG(this.label, 'STORED FILTERS', this.data.length);

        return Promise.resolve(artistId);
    }

}