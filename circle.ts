import { canvas, ctx } from "./canvas.js";
import { Vector } from "./types.js";
import {
  calcDistance,
  genRandomNumBetween,
  offsetIterator,
} from "./helpers.js";

enum AnimationType {
  CHASE = "chase",
  POUNCE = "pounce",
  SIT = "sit",
}

/**
 * Placeholder object to be replaced with a cat
 */
export class Circle {
  public position: Vector;
  public currentAnimation: AnimationType = AnimationType.CHASE;

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

  // The frame that a chase starts on
  private chaseAnimationStartedFrame = 0;

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

  // Counter variable to track the frames passed
  private frameCount = 0;

  public spriteSheet: HTMLImageElement = new Image();

  public readonly iterator = offsetIterator();

  public readonly offsets: number[] = [0, 32, 64, 96, 128, 160, 192, 224];

  public offsetIndex: number = -1;
  public yOffset: number = -1;

  constructor(x: number, y: number) {
    this.position = { x: x, y: y };
  }

  public init(): void {
    // ensure sprites are loaded before continuing
    this.spriteSheet.onload = () => {
      // start mouse position event listener
      this.trackMouse();
    };
    // store the image source
    this.spriteSheet.src = "./Sprite-0001-Recovered.png";
  }

  public draw(xOffset: number, yOffset: number): void {
    ctx?.drawImage(
      this.spriteSheet,
      xOffset,
      yOffset,
      32,
      32,
      this.position.x,
      this.position.y,
      64,
      64
    );
  }

  public selectAnimation(): void {
    // Up the frame count
    this.frameCount++;

    // Get the distance between the mouse and the circle
    const distanceX = this.mousePosition.x - this.position.x;
    const distanceY = this.mousePosition.y - this.position.y;
    const distance = calcDistance(distanceX, distanceY);

    // Start/continue the relevant animation
    switch (this.currentAnimation) {
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
        throw new Error(`Invalid Animation Type: ${this.currentAnimation}`);
    }
  }

  /**
   * Function to enable/continue chasing animation
   * @param distanceX the x component of the distance
   * @param distanceY the y component of the distance
   * @param distance kinda obvious
   */
  public chase(distanceX: number, distanceY: number, distance: number): void {
    // If the start frame hasn't been initialized
    //   - set it to the current frame count
    let absDistanceX = Math.abs(distanceX);
    let absDistanceY = Math.abs(distanceY);
    if (this.offsetIndex === -1) {
      this.offsetIndex = this.offsets[0];
    }

    this.offsetIndex = this.iterator.next().value;
    if (
      this.position.x <= this.mousePosition.x &&
      !(absDistanceY >= absDistanceX)
    ) {
      this.yOffset = 0;
    } else if (
      this.position.x >= this.mousePosition.x &&
      !(absDistanceY >= absDistanceX)
    ) {
      this.yOffset = 32;
    } else if (
      this.position.y >= this.mousePosition.y &&
      !(absDistanceX >= absDistanceY)
    ) {
      this.yOffset = 64;
    } else if (
      this.position.y <= this.mousePosition.y &&
      !(absDistanceX >= absDistanceY)
    ) {
      this.yOffset = 96;
    } else {
      this.yOffset = 0;
    }

    // If the distance is greater than the pounce threshold
    if (distance > this.POUNCE_THRESHOLD) {
      // Scale down the distance vector and add that to the circle's position
      this.position.x += distanceX * this.CHASE_SPEED;
      this.position.y += distanceY * this.CHASE_SPEED;
    }
    // or, if the distance is within the pounce threshold
    else if (distance <= this.POUNCE_THRESHOLD) {
      // set the current animation to pounce
      this.currentAnimation = AnimationType.POUNCE;

      // clear chaseAnimationStarted
      this.offsetIndex = -1;
    }

    // draw next frame
    this.draw(this.offsets[this.offsetIndex], this.yOffset);
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
      this.shimmyDuration = genRandomNumBetween(
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
        const dx = this.pounceDestination.x - this.position.x;
        const dy = this.pounceDestination.y - this.position.y;
        this.position.x += dx * this.POUNCE_SPEED;
        this.position.y += dy * this.POUNCE_SPEED;
        // Redraw circle
        this.draw(0, 160);
      }
    }
    // If we have finished the pounce
    else {
      // Reset the pounce frame tracking variables
      this.pounceAnimationStartedFrame = 0;
      framesSincePounceStart = 0;

      // If the mouse has moved out of pounce range, start chasing again
      if (distance > this.POUNCE_THRESHOLD) {
        this.currentAnimation = AnimationType.CHASE;
      }
      // Else, SIDDOWN!!!!!!!!
      else {
        this.currentAnimation = AnimationType.SIT;
      }
    }
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
      this.currentAnimation = AnimationType.CHASE;
      return false;
    }
    // If the cursor is too close, set the animation to sit and return false
    else if (distance < this.POUNCE_THRESHOLD - this.POUNCE_BUFFER) {
      this.currentAnimation = AnimationType.SIT;
      return false;
    }
    // If all is well, draw the circle and return true
    this.draw(0, 128);
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
      this.currentAnimation = AnimationType.CHASE;
    }
    this.draw(0, 128);
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
