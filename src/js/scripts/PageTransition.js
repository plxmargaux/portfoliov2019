'use strict';

/*
***************************************
* PAGE TRANSITION
***************************************
*
* This file deals with the whole website's pages transition
*
* PAGE TRANSITION
*
* */

import Swup from 'swup';
import Waves from './Waves';
import Scroll from './Scroll';
import Cursor from './Cursor';
import Gallery from './Gallery';

/*
***************************************
* PageTransition
***************************************
* */


/**
 * PageTransition class
 */
export default class PageTransition {
    constructor() {
        this.options = {
            debugMode: true,
            cache: false,
            animateHistoryBrowsing: true,
        };

        this.selectors = {
            scrollDownContainer: '.scroll-down__container > div',
        };

        this.init();
    }

    /**
     * Init function
     */
    init() {
        $('html').removeClass('is-animating');
        new Swup(this.options);

        this.addEvents();
        this.initScrollDownButton();
    }

    addEvents() {
        document.addEventListener('swup:contentReplaced', () => {
            this.initScrollDownButton();
            new Cursor();
            setTimeout(() => new Scroll(), 500);

            if ($('canvas').length > 0) {
                const canvas = 'canvas-wave';
                new Waves(canvas);
            }

            if ($('#gallery').length > 0) {
                new Gallery();
            }

            const tilt = $('[data-tilt]').tilt({
                maxTilt:        15,
                perspective:    3000,   // Transform perspective, the lower the more extreme the tilt gets.
                easing:         'cubic-bezier(.56, .37, .12, .79)',    // Easing on enter/exit.
                scale:          1,      // 2 = 200%, 1.5 = 150%, etc..
                speed:          600,    // Speed of the enter/exit transition.
            });
        });


        document.addEventListener('swup:clickLink', () => {
            $('html, body').animate({
                scrollTop: 0,
            }, 'slow')
        })
    }
    /**
     *
     */
    initScrollDownButton() {
        const text = 'scroll down';

        for (let i in text) {
            if (text[i] === ' ') {
                $(this.selectors.scrollDownContainer).append($('<span>').html('&nbsp;'));
            } else {
                $(this.selectors.scrollDownContainer).append($('<span>').text(text[i]));
            }
        }
    }
}

