import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";
/**
 * Generic placeholder name
 */
var Driver = /** @class */ (function () {
    function Driver() {
        var _this = this;
        this.circle = new Circle(Math.random() * (canvas.width - 20 * 2) + 20, Math.random() * (canvas.height - 20 * 2) + 20, 1, Math.PI * 2, 20);
        /**
         * Starts animating
         */
        this.animate = function () {
            // Schedule animate() for the next frame
            requestAnimationFrame(_this.animate);
            // Clear canvas
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            // start animating
            _this.circle.selectAnimation();
        };
    }
    // Driving logic of the program
    Driver.prototype.init = function () {
        // Start mouse position event listener
        this.circle.trackMouse(); // change to this.circle.trackMouse()
        // Start animating
        this.animate();
    };
    return Driver;
}());
// START THAT JANK
var driver = new Driver();
driver.init();
