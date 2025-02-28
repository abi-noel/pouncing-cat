import { AnimationType, Circle } from "./circle.js";
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
    Math.random() * (canvas!.width - 20 * 2) + 20,
    Math.random() * (canvas!.height - 20 * 2) + 20,
    1,
    Math.PI * 2,
    20
  );

  public pounceThreshhold = 200;

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

    // Enter the relevant animation
    switch (this.circle.currentAnimation) {
      case AnimationType.CHASE:
        this.chase();
        break;
      case AnimationType.POUNCE:
        console.log("pounce");
        break;
      default:
        throw new Error(
          `Invalid Animation Type: ${this.circle.currentAnimation} `
        );
    }
  };

  public chase(): void {
    // Get the distance between the mouse and the circle
    const distanceX = this.mousePosition.x - this.circle.position.x;
    const distanceY = this.mousePosition.y - this.circle.position.y;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    // If the distance is greater than the pounce threshhold
    if (distance > this.pounceThreshhold) {
      // Scale down the distance vector and add that to the circle's position
      this.circle.position.x += distanceX * 0.012;
      this.circle.position.y += distanceY * 0.012;
    } else {
      this.circle.currentAnimation = AnimationType.POUNCE;
    }

    // Redraw circle
    this.circle.draw();
  }

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
