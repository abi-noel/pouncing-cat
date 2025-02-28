import { ctx } from "./canvas.js";
import { Vector } from "./driver.js";

export enum AnimationType {
  CHASE = "chase",
  POUNCE = "pounce",
}

/**
 * Placeholder object to be replaced with a cat
 */
export class Circle {
  public position: Vector;
  public velocity: Vector;
  public radius: number;
  public currentAnimation: AnimationType = AnimationType.CHASE;

  constructor(x: number, y: number, dx: number, dy: number, radius: number) {
    this.position = { x: x, y: y };
    this.velocity = { x: dx, y: dy };
    this.radius = radius;
  }

  public draw(): void {
    ctx!.beginPath();
    ctx!.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx!.fillStyle = "rgb(255, 255, 255)";
    ctx!.fill();
  }
}
