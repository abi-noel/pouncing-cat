import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";
/**
 * Generic placeholder name
 */
var Driver = /** @class */ (function () {
    function Driver() {
        var _this = this;
        this.circle = new Circle(canvas.width / 2, canvas.height / 2, 1, Math.PI * 2, 20);
        // Store mouse's position
        this.mousePosition = { x: 0, y: 0 };
        /**
         * Starts animating
         */
        this.animate = function () {
            // Schedule animate() for the next frame
            requestAnimationFrame(_this.animate);
            // Clear canvas
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            // Update circle position to mouse position
            _this.circle.x = _this.mousePosition.x;
            _this.circle.y = _this.mousePosition.y;
            // Redraw circle
            _this.circle.draw();
        };
    }
    // Driving logic of the program
    Driver.prototype.init = function () {
        // Start mouse position event listener
        this.trackMouse();
        // Start animating
        this.animate();
    };
    // Defines an event listener to store the mouses position
    Driver.prototype.trackMouse = function () {
        var _this = this;
        canvas.addEventListener("mousemove", function (event) {
            _this.mousePosition.x = event.clientX;
            _this.mousePosition.y = event.clientY;
        });
    };
    return Driver;
}());
var driver = new Driver();
driver.init();
