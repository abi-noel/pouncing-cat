/**
 * Helper function to generate a random number between two values
 *   Could probably pull this out into a utils file if necessary
 * @param min lower bound
 * @param max upper bound
 * @returns an integer between the bounds
 */
export function genRandomNumBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
/**
 * Helper function to get the distance (hypotenuse) given two sides of the triangle
 * @param distanceX the x component of the distance
 * @param distanceY the y component of the distance
 * @returns the hypotenuse, aka the distance vector
 */
export function calcDistance(distanceX, distanceY) {
    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
}
