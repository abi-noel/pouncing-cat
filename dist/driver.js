import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";
class AnimationDriver {
    constructor() {
        this.cat = new Circle(Math.random() * (canvas.width - 32), Math.random() * (canvas.height - 32));
        /**
         * Starts animating
         */
        this.animate = () => {
            // Schedule animate() for the next frame
            requestAnimationFrame(this.animate);
            // Clear canvas
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            // this.cat.draw(64, 64);
            // start animating
            this.cat.selectAnimation();
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
