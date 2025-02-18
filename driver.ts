import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";

/**
 * Used for position, velocity
 * TODO if necessary move to a vector utils file or something
 */
export interface Vector {
  x: number;
  y: number;
}

/**
 * Generic placeholder name
 */
class Driver {
  public circle = new Circle(
    canvas!.width / 2,
    canvas!.height / 2,
    1,
    Math.PI * 2,
    20
  );

  // Store mouse's position
  public mousePosition: Vector = { x: 0, y: 0 };

  // Driving logic of the program
  public init(): void {
    // Start mouse position event listener
    this.trackMouse();

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

    // Update circle position to mouse position
    this.circle.position.x = this.mousePosition.x;
    this.circle.position.y = this.mousePosition.y;

    // Redraw circle
    this.circle.draw();
  };

  // Defines an event listener to store the mouses position
  public trackMouse() {
    canvas!.addEventListener("mousemove", (event) => {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    });
  }
}

const driver = new Driver();
driver.init();
