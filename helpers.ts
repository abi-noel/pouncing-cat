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
