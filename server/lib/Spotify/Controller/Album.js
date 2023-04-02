import SpotifyController from './SpotifyController.js';

export default class SpotifyAlbum extends SpotifyController {
    constructor(parent, options) {
        super(parent, options);

        this.label = 'SPOTIFY ALBUM';
        LOG(this.label, 'INIT');

        this.model = this.storage.album;
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

    add(albumData) {
        let albumDB, albumSpotify;
        const artist_id = albumData.artist_id;

        LOG(this.label, 'ADD', albumData.name, albumData.id);

        return this.model
            .getBySpotifyId(albumData.id)
            // get spotify data
            .then(data => {
                albumDB = data;

                if (!albumDB)
                    return this.getById(albumData.id);

                LOG(this.label, 'EXISTS IN DB:', albumDB.spotify_id);
                return Promise.resolve(false);
            })
            // save it
            .then(album => {
                if (!album)
                    return Promise.resolve(albumDB);

                albumSpotify = album;

                const data = {
                    name: albumSpotify.name,
                    spotify_id: albumSpotify.id,
                    artist_id: artist_id,
                    type: 'audiobook',
                    total_tracks: albumSpotify.total_tracks,
                    dt_create: nowDateTime()
                };
                return this.model.create(data);
            })
            // images
            .then(album => {
                albumDB = album;

                if (!albumSpotify)
                    return Promise.resolve();

                if (albumSpotify.images) {
                    return this.model.addImages(albumDB.id, albumSpotify.images);
                }
                return Promise.resolve();
            })
            // tracks
            .then(() => {
                return this.getTracks(albumDB);
            })
            .then(tracks => {
                albumDB.tracks = tracks;

                LOG(this.label, 'GOT TRACKS', tracks.length);
                return Promise.resolve(albumDB);
            });
    }

    update(albumId, params) {
        let album = false;

        return this.model
            .getById(albumId)
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                album = data;
                album.name = params.name;
                return this.model.update(albumId, {
                    name: params.name,
                    dt_update: nowDateTime()
                });
            })
            .then(updated => {
                if (!params.posterImageId)
                    return Promise.resolve(false);

                return this.storage.image.setPoster('album', params.posterImageId);
            })
            .then(updated => {
                return Promise.resolve(album);
            });
    }

    getById(spotifyId) {
        return this.api
            .getAlbum(spotifyId)
            .then(data => {
                //..
                return Promise.resolve(data.body);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    getByArtist(artist, limit, offset) {
        limit = limit || 10;
        offset = offset || 0;

        return this
            .getByArtistPage(artist.spotify_id, limit, offset)
            .then(data => {
                return data.map(i => ({
                    ...i,
                    ...{artist_id: artist.id}
                }));
            })
            .then(albums => {
                LOG(this.label, 'GOT', albums.length, 'ALBUMS');
                return this.addBulk(albums);
            });
    }

    getByArtistPage(spotifyId, limit, offset, items) {
        !items ? items = [] : null;

        return new Promise((resolve, reject) => {
            this.api
                .getArtistAlbums(spotifyId, {
                    limit: limit,
                    offset: offset,
                    market: 'DE'
                })
                .then((data, err) => {
                    LOG(this.label, 'ALBUM INFORMATION', data.body.items.length, limit, offset);
                    items = [...items, ...data.body.items];
                    offset = offset + limit;

                    if (offset > data.body.total) {
                        resolve(items); // exit the recursion
                    } else {
                        resolve(this.getByArtistPage(spotifyId, limit, offset, items));
                    }
                })
                .catch(e => {
                    ERROR(e);
                });
        });
    }

    getTracks(album, limit, offset) {
        return this.track.getByAlbum(album, limit, offset);
    }

    getByArtistId(id) {
        return this.model.getAllBy('artist_id', id);
    }

    getOne(id) {
        let album;
        return this.model.getOne(id)
            .then(data => {
                album = data;
                return this.artist.getOne(album.artist_id);
            })
            .then(artist => {
                album.artist = artist;
                return this.track.getByAlbumId(id);
            })
            .then(tracks => {
                album.tracks = tracks;
                return this.storage.image.getBy('album_id', album.id, 'album_image');
            })
            .then(images => {
                album.images = images;
                return Promise.resolve(album);
            });
    }

    setType(id, type) {
        const types = ['music', 'audiobook', 'podcast'];

        if (!types.includes(type))
            return Promise.resolve(false);

        return this.model.getOne(id)
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                return this.model.update(id, {
                    type: type,
                    dt_update: nowDateTime()
                });
            }).then(insert => {
                return this.model.getOne(id)
            });
    }

    toggleHidden(id) {
        return this.model.getOne(id)
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                return this.model.update(id, {
                    is_hidden: !data.is_hidden,
                    dt_update: nowDateTime()
                });
            }).then(insert => {
                return this.model.getOne(id)
            });
    }

    toggleLiked(id) {
        return this.model.getOne(id)
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                return this.model.update(id, {
                    is_liked: !data.is_liked,
                    dt_update: nowDateTime()
                });
            }).then(insert => {
                return this.model.getOne(id)
            });
    }

    getNext(albumId) {
        LOG(this.label, 'GET NEXT ALBUM FROM ALBUM:', albumId);
        let filter, album, albums;

        return this.model.getOne(albumId)
            .then(data => {
                album = data;
                filter = this.spotify.filter.data.filter(f => f.artistId === album.artist_id)[0] || {};
                return this.getByArtistId(album.artist_id);
            })
            .then(data => {
                albums = data;

                const filteredAlbums = [];
                albums.forEach(a => {
                    if (a.is_hidden === 1)
                        return;

                    if (filter.like === true && a.is_liked === 1) {

                        if (!filter.audiobook && !filter.music && !filter.podcast)
                            filteredAlbums.push(a);

                        if (filter.audiobook === true && a.type === 'audiobook')
                            filteredAlbums.push(a);

                        if (filter.music === true && a.type === 'music')
                            filteredAlbums.push(a);

                        if (filter.podcast === true && a.type === 'podcast')
                            filteredAlbums.push(a);

                    }

                    if (!filter.like) {
                        if (filter.audiobook === true && a.type === 'audiobook')
                            filteredAlbums.push(a);

                        if (filter.music === true && a.type === 'music')
                            filteredAlbums.push(a);

                        if (filter.podcast === true && a.type === 'podcast')
                            filteredAlbums.push(a);
                    }

                    if (!filter.like && !filter.audiobook && !filter.music && !filter.podcast)
                        filteredAlbums.push(a);
                });

                const index = filteredAlbums.findIndex(a => a.id === albumId);

                if (!filteredAlbums[index + 1])
                    return Promise.resolve(filteredAlbums[0]); // jump to the first album of the filtered list

                return Promise.resolve(filteredAlbums[index + 1]); // the next album
            })
            .then(nextAlbum => {
                return this.spotify.track.getByAlbumId(nextAlbum.id).then(tracks => {
                    nextAlbum.tracks = tracks;
                    return Promise.resolve(nextAlbum);
                });
            });


    }

    addImage(albumId, params) {

        let imageHash = false;
        let album = false;
        let imageData = false;

        return this.model
            .getById(albumId)
            .then(data => {
                if (!data)
                    return Promise.resolve(false);

                album = data;
                return Promise.resolve(true);
            })
            .then(albumExists => {
                if (!albumExists)
                    return Promise.resolve(false);

                if (params.imageUrl) {
                    imageHash = this.createHash(`${album.id}${params.imageUrl}`);
                    return this.storage.image.getBy('hash', imageHash, 'album_image');
                }

            }).then(imageExists => {
                if (!imageExists)
                    return Promise.resolve(false);

                if (imageExists[0])
                    return Promise.resolve(false);

                return this.storage.image
                    .downloadImage(params.imageUrl, imageHash)
                    .then(() => Promise.resolve(true))
                    .catch(err => {
                        LOG(this.label, 'IMAGE DOWNLOAD ERROR', err.code, ':', err.input);
                        return Promise.resolve(false);
                    });
            })
            .then(downloaded => {
                LOG(this.label, 'WAS DOWNLOADED', downloaded);

                if (!downloaded)
                    return Promise.resolve(false);

                imageData = {
                    album_id: album.id,
                    url: params.imageUrl,
                    height: 640,
                    width: 640,
                    hash: imageHash,
                    is_poster: 0
                };

                return this.storage.image.create(imageData, 'album');
            })
            .then(id => {
                if (!id)
                    return Promise.resolve(false);

                imageData.id = id;
                return Promise.resolve(imageData);
            });
    }

    // ---------------

    get artist() {
        return this.spotify.artist;
    }

    set artist(val) {

    }

    get track() {
        return this.spotify.track;
    }

    set track(val) {

    }
}