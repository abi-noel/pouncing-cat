import { Cat } from "./cat.js";
import { ctx, canvas } from "./canvas.js";
// how often to shift spritesheet frames per second
const FPS = 10;
// how many milliseconds should pass per spritesheet frame
const MS_PER_FRAME = 1000 / FPS;
class AnimationDriver {
    constructor() {
        this.cat = new Cat(Math.random() * (canvas.width - 32), Math.random() * (canvas.height - 32));
        // holds the last time a frame was shifted
        this.msPrev = window.performance.now();
        // whether or not the sprite frame should advance to the next one on this animation frame
        this.shouldAdvance = false;
        /**
         * Starts animating
         */
        this.animate = () => {
            // the epoch time at the time that this function was called
            let msNow = window.performance.now();
            // how many milliseconds have passed since the previous frame was drawn
            const msPassed = msNow - this.msPrev;
            // schedule the next animation frame
            requestAnimationFrame(this.animate);
            // if the ms passed hasn't exceeded the max ms per frame
            if (msPassed < MS_PER_FRAME) {
                // the sprite should not advance
                this.shouldAdvance = false;
            }
            else {
                // set msPrev to the current time as the last time the sprite advanced
                this.msPrev = msNow;
                // the sprite should advance
                this.shouldAdvance = true;
            }
            // Clear canvas
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            // Update animation
            this.cat.selectAnimation(this.shouldAdvance);
        };
    }
    // Driving logic of the program
    init() {
        // initialize the cat
        this.cat.init();
        // Start animating
        this.animate();
    }
}
// START THAT JANK
const animationDriver = new AnimationDriver();
animationDriver.init();
