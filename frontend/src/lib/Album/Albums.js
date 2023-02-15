import AlbumsTemplate from "./Templates/albums.html";
import Album from './Album.js';

import Swiper from 'swiper';

export default class Albums extends MODULECLASS {
    constructor(parent, options) {
        super(parent);
        this.label = 'ALBUMS'

        this.dragging = false;

        this.target = this.toDOM(AlbumsTemplate({
            scope: options
        }));

        this.albums = [];
        options.albums.forEach(album => this.albums.push(new Album(this, album)));

        this.target.onmousemove = (e) => {
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
            this.drag();
        }

        this.target.ondragstart = () => this.dragging = true;
        this.target.ondragend = () => this.dragging = false;
    }

    drag() {
        if (!this.dragging)
            return;

        LOG('>>> DRAGGING', this.mouseX, this.mouseY);
    }

    addSlider() {
        this.swiper ? this.swiper.destroy() : null;

        this.sliderClass = `[data-artist-albums]`; // @TODO
        this.swiper = new Swiper(this.sliderClass, {
            // Optional parameters
            direction: 'horizontal',
            loop: false,
            slidesPerView: 8,
            spaceBetween: 20,
        });
    }
}
