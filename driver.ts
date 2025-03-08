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

  // Counter variable to track the frames passed
  private frameCount = 0;

  /**
   * Pounce animation
   */
  // The distance in pixels indicating when to begin a pounce
  private readonly POUNCE_THRESHOLD = 200;

  // Buffer to be used with the pounce threshold
  //   Utilized in the case where a pounce has started, but the user has slightly moved
  //   the cursor out of range. We don't want to awkwardly start and stop the animation.
  private readonly POUNCE_BUFFER = 75;

  // Arbitrary number of frames for the pounce to last.
  //   My display is 60 fps, so a pounce will last 1 second, not including the shimmy.
  private readonly POUNCE_DURATION = 60;

  // The percentage of the distance vector to add to the circle's
  // position when pouncing
  private readonly POUNCE_SPEED = 0.1;

  // The frame that a pounce starts on
  private pounceAnimationStartedFrame = 0;

  // Pounce destination stored on the first frame after the shimmy
  private pounceDestination: Vector = { x: 0, y: 0 };

  /**
   * Chase animation
   */
  // The percentage of the distance vector to add to the circle's position when chasing
  private readonly CHASE_SPEED = 0.01;

  /**
   * Shimmy animation
   */
  // How long the cat should shimmy for
  //   This is randomly generated on each start of a pounce
  private shimmyDuration = 0;

  // The minimum number of frames a shimmy can be
  private readonly MIN_SHIMMY_DURATION = 20;

  // The maximum number of frames a shimmy can be
  private readonly MAX_SHIMMY_DURATION = 120;

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
    // Up the frame count
    this.frameCount++;

    // Get the distance between the mouse and the circle
    const distanceX = this.mousePosition.x - this.circle.position.x;
    const distanceY = this.mousePosition.y - this.circle.position.y;
    const distance = this.calcDistance(distanceX, distanceY);

    // Schedule animate() for the next frame
    requestAnimationFrame(this.animate);

    // Clear canvas
    ctx!.clearRect(0, 0, innerWidth, innerHeight);

    // Start/continue the relevant animation
    switch (this.circle.currentAnimation) {
      case AnimationType.CHASE:
        this.chase(distanceX, distanceY, distance);
        break;
      case AnimationType.POUNCE:
        this.pounce(distance);
        break;
      case AnimationType.SIT:
        this.sit(distance);
        break;
      default:
        throw new Error(
          `Invalid Animation Type: ${this.circle.currentAnimation}`
        );
    }
  };

  /**
   * Helper function to generate a random number between two values
   *   Could probably pull this out into a utils file if necessary
   * @param min lower bound
   * @param max upper bound
   * @returns an integer between the bounds
   */
  public genRandomNumBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Helper function to get the distance (hypotenuse) given two sides of the triangle
   * @param distanceX the x component of the distance
   * @param distanceY the y component of the distance
   * @returns the hypotenuse, aka the distance vector
   */
  public calcDistance(distanceX: number, distanceY: number): number {
    return Math.sqrt(distanceX ** 2 + distanceY ** 2);
  }

  /**
   * Function to enable/continue chasing animation
   * @param distanceX the x component of the distance
   * @param distanceY the y component of the distance
   * @param distance kinda obvious
   */
  public chase(distanceX: number, distanceY: number, distance: number): void {
    // If the distance is greater than the pounce threshold
    if (distance > this.POUNCE_THRESHOLD) {
      // Scale down the distance vector and add that to the circle's position
      this.circle.position.x += distanceX * this.CHASE_SPEED;
      this.circle.position.y += distanceY * this.CHASE_SPEED;
    }
    // or, if the distance is within the pounce threshold
    else if (distance < this.POUNCE_THRESHOLD) {
      // set the current animation to pounce
      this.circle.currentAnimation = AnimationType.POUNCE;
    }

    // Redraw circle
    this.circle.draw();
  }

  /**
   * Function to enable/continue pouncing animation
   * @param distance between the circle and the mouse
   */
  public pounce(distance: number): void {
    // If the start frame hasn't been initialized
    //   - set it to the current frame count
    //   - generate a random shimmy duration for this pounce
    // This ensures these values are only set on the first frame of the animation
    if (this.pounceAnimationStartedFrame === 0) {
      this.pounceAnimationStartedFrame = this.frameCount;
      this.shimmyDuration = this.genRandomNumBetween(
        this.MAX_SHIMMY_DURATION,
        this.MIN_SHIMMY_DURATION
      );
    }

    // Calculate how long we have been in this animation
    let framesSincePounceStart =
      this.frameCount - this.pounceAnimationStartedFrame;

    // If we haven't finished the pounce (includes the pounce duration and shimmy duration)
    if (framesSincePounceStart <= this.POUNCE_DURATION + this.shimmyDuration) {
      // If we haven't finished the shimmy
      if (framesSincePounceStart <= this.shimmyDuration) {
        // Try to start/continue shimmy
        // If the cursor goes out of range, end the pounce and reset pounce variables
        if (!this.tryShimmy(distance)) {
          framesSincePounceStart = 0;
          this.pounceAnimationStartedFrame = 0;
        }
      }
      // If we have finished the shimmy,
      else {
        // and if this is the first frame of the actual pounce motion
        if (framesSincePounceStart === this.shimmyDuration + 1) {
          // Store the distance between the mouse and the circle as its destination
          this.pounceDestination = {
            x: this.mousePosition.x,
            y: this.mousePosition.y,
          };
        }

        // Scale down the distance vector and add that to the circle's position
        const dx = this.pounceDestination.x - this.circle.position.x;
        const dy = this.pounceDestination.y - this.circle.position.y;
        this.circle.position.x += dx * this.POUNCE_SPEED;
        this.circle.position.y += dy * this.POUNCE_SPEED;
      }
    }
    // If we have finished the pounce
    else {
      // Reset the pounce frame tracking variables
      this.pounceAnimationStartedFrame = 0;
      framesSincePounceStart = 0;

      // If the mouse has moved out of pounce range, start chasing again
      if (distance > this.POUNCE_THRESHOLD) {
        this.circle.currentAnimation = AnimationType.CHASE;
      }
      // Else, SIDDOWN!!!!!!!!
      else {
        this.circle.currentAnimation = AnimationType.SIT;
      }
    }
    // Redraw circle
    this.circle.draw();
  }

  /**
   * Function to start/continue shimmy animation
   *   The shimmy is considered part of the overall pounce animation
   *   Occurs for a randomly generated number of frames
   * @param distance between the circle and cursor
   * @returns whether to continue the shimmy or not
   */
  public tryShimmy(distance: number): boolean {
    // If the cursor is out of range (use the buffer to prevent starting and stopping),
    // set the animation to chase and return false to stop the shimmy.
    if (distance > this.POUNCE_THRESHOLD + this.POUNCE_BUFFER) {
      this.circle.currentAnimation = AnimationType.CHASE;
      return false;
    }
    // If the cursor is too close, set the animation to sit and return false
    else if (distance < this.POUNCE_THRESHOLD - this.POUNCE_BUFFER) {
      this.circle.currentAnimation = AnimationType.SIT;
      return false;
    }
    // If all is well, draw the circle and return true
    this.circle.draw();
    return true;
  }

  /**
   * Animation that is called when the cursor is too close for a pounce
   * @param distance between the cursor and the cat
   */
  public sit(distance: number): void {
    // If the cursor exits the pounce range, start chasing again
    // If the cursor is in between the buffer and the pounce threshold, chase() will
    // just set it back to pounce. This ensures that a pounce can start without
    // needing the mouse to move out of range and then back in range
    if (distance > this.POUNCE_THRESHOLD - this.POUNCE_BUFFER) {
      this.circle.currentAnimation = AnimationType.CHASE;
    }
    this.circle.draw();
  }

  /**
   * Defines an event listener to store the mouses position
   */
  public trackMouse(): void {
    canvas!.addEventListener("mousemove", (event) => {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    });
  }
}

// START THAT JANK
const driver = new Driver();
driver.init();
