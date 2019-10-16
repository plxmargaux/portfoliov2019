'use strict';

/*
***************************************
* MAIN
***************************************
*
* This file is the main scripts file.
*
* MAIN
*
* */

import Cursor from './Cursor.js';
import PageTransition from './PageTransition';
import Waves from './Waves';
import Scroll from './Scroll';
import Gallery from './Gallery';
import 'tilt.js';

/**
 * MAIN class
 */
export default class Main {
    /**
     * Init function
     */
    static init() {
        new Cursor();
        new PageTransition();
        new Scroll();

        if ($('#gallery').length > 0) {
            new Gallery();
        }

        if ($('canvas').length > 0) {
            const canvas = 'canvas-wave';
            new Waves(canvas);
        }

        const tilt = $('[data-tilt]').tilt({
            maxTilt:        15,
            perspective:    3000,   // Transform perspective, the lower the more extreme the tilt gets.
            scale:          1,      // 2 = 200%, 1.5 = 150%, etc..
            speed:          600,    // Speed of the enter/exit transition.
        });
    }
}
