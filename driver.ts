import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";

/**
 * Generic placeholder name
 */
class AnimationDriver {
  public circle = new Circle(
    Math.random() * (canvas!.width - 20 * 2) + 20,
    Math.random() * (canvas!.height - 20 * 2) + 20,
    1,
    Math.PI * 2,
    20
  );

  // Driving logic of the program
  public init(): void {
    // Start mouse position event listener
    this.circle.trackMouse(); // change to this.circle.trackMouse()

    // Start animating
    this.animate();
  }

  /**
   * Starts animating
   */
  public animate = () => {
    // Schedule animate() for the next frame
    requestAnimationFrame(this.animate);

    // Clear canvas
    ctx!.clearRect(0, 0, innerWidth, innerHeight);

    // start animating
    this.circle.selectAnimation();
  };
}

// START THAT JANK
const animationDriver = new AnimationDriver();
animationDriver.init();
