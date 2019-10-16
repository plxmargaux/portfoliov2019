'use strict';

/*
***************************************
* GALLERY
***************************************
*
* This file deals with the gallery images
*
* GALLERY
*
* */

/**
 * GALLERY class
 */
export default class Gallery {
    constructor() {
        this.images = $('#gallery').find('.card');
        this.constructor.init(this.images);
    }

    /**
     * Init function
     */
    static init(images) {
        new ImageGallery(images);
    }
}

class ImageGallery {
    constructor(images) {
        this.images = images;
        this.$images = null;
        this.$body = $('body');
        this.$html = $('html');
        this.dir = './img/gallery/large/';
        this.modalCreated = false;
        this.init();
    }

    init() {
        this.$images = $(this.images);
        this.addEvents();
    }

    addEvents() {
        this.$images.click((e) => {
            const $image = $(e.currentTarget);
            const imgId = $image.data('id');
            const imgNb = $image.data('number-images');
            this.openModalGallery($image, imgId, imgNb);
        });

        $(document).keyup((e) => {
            if (e.key === "Escape") {
                this.closeModalGallery()
            }
        });
    }

    openModalGallery(image, imgId, imgNb) {
        let promises = [];
        const stringCloseButton = '.close';
        const modalContent = '.modal-content';
        const modalWrapper = '.modal-wrapper';

        if (!this.modalCreated) {
            const modalTemplate = `<div class="modal-wrapper">
                <span class="close link-item">Close</span>
                <div class="modal-content"></div>
            </div>`;
            this.$body.append(modalTemplate);
            this.$body.on('click', stringCloseButton, () => this.closeModalGallery());
            this.modalCreated = true;
        } else {
            $(modalContent).empty();
        }

        $('.column__content').addClass('hidden');

        for (let i = 1; i <= imgNb; i++) {
            promises.push(this.loadImages(imgId, i))
        }

        const promise = Promise.all(promises);
        promise.then((images) => {
            images.forEach((image) => {
                $(modalContent).append(image);
            });

            $(modalWrapper).addClass('active');
            setTimeout(() => {
                this.$body.add(this.$html).addClass('is-overlay');
            }, 800);
        });
    }

    closeModalGallery() {
        $('.modal-wrapper').removeClass('active');
        setTimeout(() => {
            $('.column__content').removeClass('hidden');
            this.$body.add(this.$html).removeClass('is-overlay');
        }, 700)
    }

    loadImages(imgId, index) {
        return new Promise((resolve, reject) => {
            let url = this.dir + imgId + `/` + imgId + `-` + index + `.jpg`;
            let alt = 'close up ' + imgId + '-' + index;

            let img = new Image();
            img.src = url;
            img.alt = alt;
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', () => {
                reject(new Error(`Failed to load image's URL: ${url}`));
            });
        });
    }
}
