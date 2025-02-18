import { ctx } from "./canvas.js";

export class Circle {
  public x: number;
  public y: number;
  public dx: number;
  public dy: number;
  public radius: number;

  constructor(x: number, y: number, dx: number, dy: number, radius: number) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
  }

  public draw(): void {
    ctx!.beginPath();
    ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx!.fillStyle = "rgb(255, 255, 255)";
    ctx!.fill();
  }

  public update(): void {
    this.draw();
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
  }
}
