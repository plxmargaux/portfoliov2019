'use strict';

/*
***************************************
* CURSOR
***************************************
*
* This file is about the custom cursor of this website
*
* */

/**
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */

import TweenMax from 'gsap/TweenMax';
import TimelineLite from 'gsap/TimelineLite';

/**
 * CURSOR class
 */
export default class Cursor {
    /**
     * Cursor constructor
     */
    constructor() {
        this.outerCursorSelector = '.cursor--outer';
        this.innerCursorSelector = '.cursor--inner';
        this.$window = $(window);
        this.breakpoint = 768;

        // Initialize the Cursor
        if(this.$window.width() > this.breakpoint) {
            this.initCursor();
            this.initHovers();
            this.initClicks();
        }
    }

    /**
     * init Cursor variables
     */
    initCursor() {
        this.outerCursor = $(this.outerCursorSelector);
        this.innerCursor = $(this.innerCursorSelector);
        this.outerCursorBox = this.outerCursor[0].getBoundingClientRect();
        this.outerCursorSpeed = 0;
        this.isHovering = false;
        this.clientX = -100;
        this.clientY = -100;
        this.showCursor = false;

        const unveilCursor = () => {
            TweenMax.set(this.innerCursor, {
                x: this.clientX,
                y: this.clientY
            });
            TweenMax.set(this.outerCursor, {
                x: this.clientX - this.outerCursorBox.width / 2,
                y: this.clientY - this.outerCursorBox.height / 2
            });
            setTimeout(() => {
                this.outerCursorSpeed = 0.6;
            }, 100);
            this.showCursor = true;
        };
        document.addEventListener('mousemove', unveilCursor);

        document.addEventListener('mousemove', e => {
            this.clientX = e.clientX;
            this.clientY = e.clientY;
        });

        const render = () => {
            TweenMax.set(this.innerCursor, {
                x: this.clientX,
                y: this.clientY
            });

            TweenMax.to(this.outerCursor, this.outerCursorSpeed, {
                x: this.clientX - this.outerCursorBox.width / 2,
                y: this.clientY - this.outerCursorBox.height / 2
            });
            if (this.showCursor) {
                document.removeEventListener('mousemove', unveilCursor);
            }
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }

    initHovers() {
        const handleMouseEnter = () => {
            this.isHovering = true;
            TweenMax.to(this.outerCursor, 0.2, {
                scaleX: 2,
                scaleY: 2,
                backgroundColor: `rgba(255, 255, 255, .5)`,
                opacity: 0.4,
            });
        };

        const handleMouseLeave = () => {
            this.isHovering = false;
            TweenMax.to(this.outerCursor, 0.2, {
                x: this.clientX - this.outerCursorBox.width / 2,
                y: this.clientY - this.outerCursorBox.height / 2,
                scaleX: 1,
                scaleY: 1,
                opacity: 0.2,
            });
        };

        const linkItems = $('.link-item, a');
        linkItems.each((index, element) => {
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    initClicks() {
        const revealCursor = () => {
            const timeline = new TimelineLite();
            timeline
            .to(this.outerCursor, 0.125, {scaleX: 2.1, scaleY: 2.1, opacity: 0})
            .from(this.outerCursor, 0.125, {delay: .1, scaleX: 0, scaleY: 0, opacity: 0});


            if (this.isHovering) {
                TweenMax.set(this.outerCursor, {
                    scaleX: 2,
                    scaleY: 2,
                    opacity: .2,
                });
            } else {
                TweenMax.set(this.outerCursor, {
                    scaleX: 1,
                    scaleY: 1,
                    opacity: .2,
                });
            }
        };

        document.addEventListener('mousedown', revealCursor);
    }
}


