import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";
/**
 * Generic placeholder name
 */
var Driver = /** @class */ (function () {
    function Driver() {
        var _this = this;
        this.circle = new Circle(Math.random() * (canvas.width - 20 * 2) + 20, Math.random() * (canvas.height - 20 * 2) + 20, 1, Math.PI * 2, 20);
        this.pounceThreshhold = 200;
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
            // Get the distance between the mouse and the circle
            var distanceX = _this.mousePosition.x - _this.circle.position.x;
            var distanceY = _this.mousePosition.y - _this.circle.position.y;
            var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            // If the distance is greater than the pounce threshhold
            if (distance > _this.pounceThreshhold) {
                // Scale down the distance vector and add that to the circle's position
                _this.circle.position.x += distanceX * 0.012;
                _this.circle.position.y += distanceY * 0.012;
            }
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
