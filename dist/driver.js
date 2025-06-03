import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";
/**
 * Generic placeholder name
 */
var AnimationDriver = /** @class */ (function () {
    function AnimationDriver() {
        var _this = this;
        this.cat = new Circle(Math.random() * (canvas.width - 20 * 2) + 20, Math.random() * (canvas.height - 20 * 2) + 20);
        /**
         * Starts animating
         */
        this.animate = function () {
            // Schedule animate() for the next frame
            requestAnimationFrame(_this.animate);
            // Clear canvas
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            // start animating
            _this.cat.selectAnimation();
        };
    }
    // Driving logic of the program
    AnimationDriver.prototype.init = function () {
        // initialize the cat
        this.cat.init();
        // Start animating
        this.animate();
    };
    return AnimationDriver;
}());
// START THAT JANK
var animationDriver = new AnimationDriver();
animationDriver.init();
