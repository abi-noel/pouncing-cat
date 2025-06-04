import { canvas, ctx } from "./canvas.js";
import { calcDistance, genRandomNumBetween, offsetIterator, } from "./helpers.js";
var AnimationType;
(function (AnimationType) {
    AnimationType["CHASE"] = "chase";
    AnimationType["POUNCE"] = "pounce";
    AnimationType["SIT"] = "sit";
})(AnimationType || (AnimationType = {}));
/**
 * Placeholder object to be replaced with a cat
 */
export class Circle {
    constructor(x, y) {
        this.currentAnimation = AnimationType.CHASE;
        /**
         * Pounce animation
         */
        // The distance in pixels indicating when to begin a pounce
        this.POUNCE_THRESHOLD = 200;
        // Buffer to be used with the pounce threshold
        //   Utilized in the case where a pounce has started, but the user has slightly moved
        //   the cursor out of range. We don't want to awkwardly start and stop the animation.
        this.POUNCE_BUFFER = 75;
        // Arbitrary number of frames for the pounce to last.
        //   My display is 60 fps, so a pounce will last 1 second, not including the shimmy.
        this.POUNCE_DURATION = 60;
        // The percentage of the distance vector to add to the circle's
        // position when pouncing
        this.POUNCE_SPEED = 0.1;
        // The frame that a pounce starts on
        this.pounceAnimationStartedFrame = 0;
        // Pounce destination stored on the first frame after the shimmy
        this.pounceDestination = { x: 0, y: 0 };
        /**
         * Chase animation
         */
        // The percentage of the distance vector to add to the circle's position when chasing
        this.CHASE_SPEED = 0.01;
        // The frame that a chase starts on
        this.chaseAnimationStartedFrame = 0;
        /**
         * Shimmy animation
         */
        // How long the cat should shimmy for
        //   This is randomly generated on each start of a pounce
        this.shimmyDuration = 0;
        // The minimum number of frames a shimmy can be
        this.MIN_SHIMMY_DURATION = 20;
        // The maximum number of frames a shimmy can be
        this.MAX_SHIMMY_DURATION = 120;
        // Store mouse's position
        this.mousePosition = { x: 0, y: 0 };
        // Counter variable to track the frames passed
        this.frameCount = 0;
        this.spriteSheet = new Image();
        this.iterator = offsetIterator();
        this.offsets = [0, 32, 64, 96, 128, 160, 192, 224];
        this.position = { x: x, y: y };
    }
    init() {
        // ensure sprites are loaded before continuing
        this.spriteSheet.onload = () => {
            // start mouse position event listener
            this.trackMouse();
        };
        // store the image source
        this.spriteSheet.src = "./Sprite-0001-Recovered.png";
    }
    draw(xOffset, yOffset) {
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(this.spriteSheet, xOffset, yOffset, 32, 32, this.position.x, this.position.y, 64, 64);
    }
    selectAnimation() {
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
    chase(distanceX, distanceY, distance) {
        // If the start frame hasn't been initialized
        //   - set it to the current frame count
        let offsetIndex;
        let yOffset;
        if (this.chaseAnimationStartedFrame === 0) {
            this.chaseAnimationStartedFrame = this.frameCount;
            offsetIndex = this.offsets[0];
        }
        // Calculate how long we have been in this animation
        // let framesSinceChaseStart =
        //   this.frameCount + 1 - this.chaseAnimationStartedFrame;
        // console.log(framesSinceChaseStart);
        // if (framesSinceChaseStart % 8 !== 0) {
        //   offset = this.iterator.next().value;
        //   console.log(offset);
        // }
        offsetIndex = this.iterator.next().value;
        // console.log(this.offsets[offsetIndex]);
        if (this.position.x <= this.mousePosition.x && !(distanceY >= distanceX)) {
            yOffset = 0;
        }
        else if (this.position.x >= this.mousePosition.x &&
            !(distanceY >= distanceX)) {
            yOffset = 32;
        }
        else if (this.position.y >= this.mousePosition.y &&
            !(distanceX >= distanceY)) {
            yOffset = 64;
        }
        else if (this.position.y <= this.mousePosition.y &&
            !(distanceX >= distanceY)) {
            yOffset = 96;
        }
        console.log("distanceX: ", distanceX); // distanceX is negative when the cursor is to the left of the cat
        console.log("distanceY", distanceY); // distanceY is negative when the cursor is above the cat
        // If the distance is greater than the pounce threshold
        if (distance > this.POUNCE_THRESHOLD) {
            // Scale down the distance vector and add that to the circle's position
            this.position.x += distanceX * this.CHASE_SPEED;
            this.position.y += distanceY * this.CHASE_SPEED;
            // increment
        }
        // or, if the distance is within the pounce threshold
        else if (distance <= this.POUNCE_THRESHOLD) {
            // set the current animation to pounce
            this.currentAnimation = AnimationType.POUNCE;
            // clear chaseAnimationStarted
            this.chaseAnimationStartedFrame = 0;
        }
        // draw next frame
        this.draw(this.offsets[offsetIndex], yOffset);
    }
    /**
     * Function to enable/continue pouncing animation
     * @param distance between the circle and the mouse
     */
    pounce(distance) {
        // If the start frame hasn't been initialized
        //   - set it to the current frame count
        //   - generate a random shimmy duration for this pounce
        // This ensures these values are only set on the first frame of the animation
        if (this.pounceAnimationStartedFrame === 0) {
            this.pounceAnimationStartedFrame = this.frameCount;
            this.shimmyDuration = genRandomNumBetween(this.MAX_SHIMMY_DURATION, this.MIN_SHIMMY_DURATION);
        }
        // Calculate how long we have been in this animation
        let framesSincePounceStart = this.frameCount - this.pounceAnimationStartedFrame;
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
        // Redraw circle
        this.draw(0, 0);
    }
    /**
     * Function to start/continue shimmy animation
     *   The shimmy is considered part of the overall pounce animation
     *   Occurs for a randomly generated number of frames
     * @param distance between the circle and cursor
     * @returns whether to continue the shimmy or not
     */
    tryShimmy(distance) {
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
        this.draw(0, 0);
        return true;
    }
    /**
     * Animation that is called when the cursor is too close for a pounce
     * @param distance between the cursor and the cat
     */
    sit(distance) {
        // If the cursor exits the pounce range, start chasing again
        // If the cursor is in between the buffer and the pounce threshold, chase() will
        // just set it back to pounce. This ensures that a pounce can start without
        // needing the mouse to move out of range and then back in range
        if (distance > this.POUNCE_THRESHOLD - this.POUNCE_BUFFER) {
            this.currentAnimation = AnimationType.CHASE;
        }
        this.draw(0, 0);
    }
    /**
     * Defines an event listener to store the mouses position
     */
    trackMouse() {
        canvas.addEventListener("mousemove", (event) => {
            this.mousePosition.x = event.clientX;
            this.mousePosition.y = event.clientY;
        });
    }
}
