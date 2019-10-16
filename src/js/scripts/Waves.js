'use strict';

/*
***************************************
* WAVES
***************************************
*
* This file deals with waves animation
*
* WAVES
*
* */

import TweenMax from 'gsap/TweenMax';
import TweenLite from 'gsap/TweenLite';

/*
***************************************
* Waves
***************************************
* */


/**
 * Waves class
 */
export default class Waves {
    constructor(canvas) {
        this.canvas = canvas;
        this.colors = {
            blue: '#8ccae0',
            pink: '#FAB8B8',
            yellow: '#ffd782',
        };

        this.init();
    }

    /**
     * Init function
     */
    init() {
        this.makeWaves();
    }

    /**
     * Make waves move
     */
    makeWaves() {
        const canvas = document.getElementById(this.canvas);
        const context = canvas.getContext('2d');
        const resolution = window.devicePixelRatio || 1;

        let waves = [];
        let resized = false;

        let vw;
        let vh;
        let colorFirstWave = null;
        let colorSecondWave = null;


        switch (canvas.classList.value) {
            case 'blue':
                colorFirstWave = this.colors.pink;
                colorSecondWave = this.colors.blue;
                break;
            case 'yellow':
                colorFirstWave = this.colors.blue;
                colorSecondWave = this.colors.yellow;
                break;
            default:
                colorFirstWave = this.colors.blue;
                colorSecondWave = this.colors.pink;
        }

        resizeCanvas();

        const wave1 = createWave(context, {
            amplitude: 50,
            duration: 6,
            fillStyle: colorFirstWave,
            frequency: 2.5,
            width: vw,
            height: vh,
            segments: 100,
            waveHeight: vh * 0.25
        });

        const wave2 = createWave(context, {
            amplitude: 100,
            duration: 4,
            fillStyle: colorSecondWave,
            frequency: 1.5,
            width: vw,
            height: vh,
            segments: 100,
            waveHeight: vh * 0.25
        });

        waves.push(wave1, wave2);


        window.addEventListener("resize", function() {
            resized = true;
        });

        TweenLite.ticker.addEventListener("tick", update);

        function update() {

            const len = waves.length;

            if (resized) {

                resizeCanvas();

                for (let i = 0; i < len; i++) {
                    waves[i].resize(vw, vh);
                }

                resized = false;
            }

            context.clearRect(0, 0, vw, vh);

            for (let i = 0; i < len; i++) {
                waves[i].draw();
            }
        }

        function createWave(context, options) {

            options = options || {};

            // API
            const wave = {

                // Properties
                amplitude: options.amplitude || 200,
                context: context,
                curviness: options.curviness || 0.75,
                duration: options.duration || 2,
                fillStyle: options.fillStyle,
                frequency: options.frequency || 4,
                height: options.height || 600,
                points: [],
                segments: options.segments || 100,
                tweens: [],
                waveHeight: options.waveHeight || 300,
                width: options.width || 800,
                x: options.x || 0,
                y: options.y || 0,

                // Methods
                init: init,
                resize: resize,
                draw: draw,
                kill: kill
            };

            init();

            function kill() {

                const tweens = wave.tweens;
                const len = tweens.length;

                for (let i = 0; i < len; i++) {
                    tweens[i].kill();
                }

                tweens.length = 0;
                wave.points.length = 0;
            }

            function init() {

                kill();

                const segments = wave.segments;
                const interval = wave.width / segments;

                for (let i = 0; i <= segments; i++) {

                    let norm = i / segments;
                    let point = {
                        x: wave.x + i * interval,
                        y: 1
                    };

                    const tween = TweenMax.to(point, wave.duration, {
                        y: -1,
                        repeat: -1,
                        yoyo: true,
                        ease: Sine.easeInOut
                    }).progress(norm * wave.frequency);

                    wave.tweens.push(tween);
                    wave.points.push(point);
                }
            }

            function draw() {

                const points = wave.points;
                const len = points.length;

                const startY = wave.waveHeight;
                const height = wave.amplitude / 2;

                context.beginPath();
                context.moveTo(points[0].x, startY + points[0].y * height);

                for (let i = 1; i < len; i++) {

                    const point = points[i];
                    context.lineTo(point.x, startY + point.y * height);
                }

                context.lineTo(wave.x + wave.width, wave.y + wave.height);
                context.lineTo(wave.x, wave.y + wave.height);
                context.closePath();
                context.fillStyle = wave.fillStyle;
                context.fill();
            }

            function resize(width, height) {

                wave.width = width;
                wave.height = height;

                const points = wave.points;
                const len = points.length;
                const interval = wave.width / wave.segments;

                for (let i = 0; i < len; i++) {

                    const point = points[i];
                    point.x = wave.x + i * interval;
                }
            }

            return wave;
        }

        function resizeCanvas() {

            vw = window.innerWidth;
            vh = 260;

            canvas.width = vw * resolution;
            canvas.height = vh * resolution;

            canvas.style.width = vw + "px";
            canvas.style.height = vh + "px";

            context.scale(resolution, resolution);
        }
    }
}

