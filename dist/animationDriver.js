import { Cat } from "./cat.js";
import { ctx, canvas } from "./canvas.js";
class AnimationDriver {
    constructor() {
        this.cat = new Cat(Math.random() * (canvas.width - 32), Math.random() * (canvas.height - 32));
        // holds the last time a sprite frame was shifted
        this.prevSpriteFrameMs = window.performance.now();
        // holds the last time an animation frame was shifted
        this.prevGlobalFrameMs = window.performance.now();
        // whether or not the sprite frame should advance to the next one on this animation frame
        this.shouldAdvance = false;
        /**
         * Starts animating
         */
        this.animate = () => {
            // the epoch time at the time that this function was called
            let msNow = window.performance.now();
            // how many milliseconds have passed since the previous sprite and global frame was drawn
            const msPassedSprite = msNow - this.prevSpriteFrameMs;
            const msPassedGlobal = msNow - this.prevGlobalFrameMs;
            // schedule the next animation frame
            requestAnimationFrame(this.animate);
            // if ms passed hasn't exceeded the max global ms per frame
            if (msPassedGlobal < AnimationDriver.MS_PER_GLOBAL_FRAME)
                return;
            // if the function didn't return early, store the global ms frame
            this.prevGlobalFrameMs = msNow;
            // if the ms passed hasn't exceeded the max ms per sprite frame
            if (msPassedSprite < AnimationDriver.MS_PER_SPRITE_FRAME) {
                // the sprite should not advance
                this.shouldAdvance = false;
            }
            else {
                // set prev sprite frame ms to the current time as the last time the sprite advanced
                this.prevSpriteFrameMs = msNow;
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
// how often to shift spritesheet frames per second
AnimationDriver.SPRITE_FPS = 60;
// how many milliseconds should pass per spritesheet frame
AnimationDriver.MS_PER_SPRITE_FRAME = 1000 / AnimationDriver.SPRITE_FPS;
// how often to shift spritesheet frames per second
AnimationDriver.GLOBAL_FPS = 60;
// how many milliseconds should pass per spritesheet frame
AnimationDriver.MS_PER_GLOBAL_FRAME = 1000 / AnimationDriver.GLOBAL_FPS;
// START THAT JANK
const animationDriver = new AnimationDriver();
animationDriver.init();
