/**
 * Helper function to generate a random number between two values
 *   Could probably pull this out into a utils file if necessary
 * @param min lower bound
 * @param max upper bound
 * @returns an integer between the bounds
 */
export function genRandomNumBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Helper function to get the distance (hypotenuse) given two sides of the triangle
 * @param distanceX the x component of the distance
 * @param distanceY the y component of the distance
 * @returns the hypotenuse, aka the distance vector
 */
export function calcDistance(distanceX: number, distanceY: number): number {
  return Math.sqrt(distanceX ** 2 + distanceY ** 2);
}

export function* offsetIterator(): Generator<number> {
  let count = 0;
  while (true) {
    if (count < 7) count++;
    else count = 0;

    yield count;
  }

  // this version emits each frame twice to slow down the frame rate
  // let count = 0;
  // let i = 0;
  // while (true) {
  //   if (count < 7) {
  //     if (i % 2 === 0) {
  //       count++;
  //     }
  //   } else count = 0;

  //   i++;
  //   yield count;
  // }
}
