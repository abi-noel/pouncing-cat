import { ctx } from "./canvas.js";
/**
 * Placeholder object to be replaced with a cat
 */
var Circle = /** @class */ (function () {
    function Circle(x, y, dx, dy, radius) {
        this.position = { x: x, y: y };
        this.velocity = { x: dx, y: dy };
        this.radius = radius;
    }
    Circle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fill();
    };
    return Circle;
}());
export { Circle };
