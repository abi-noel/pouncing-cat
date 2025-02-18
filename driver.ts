import { Circle } from "./circle.js";
import { ctx, canvas } from "./canvas.js";

class Driver {
  public circle = new Circle(
    canvas!.width / 2,
    canvas!.height / 2,
    1,
    Math.PI * 2,
    20
  );

  public init(): void {
    this.circle.draw();
  }
}
const driver = new Driver();
driver.init();
