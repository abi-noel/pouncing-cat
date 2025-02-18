/**
 * IDK I just wanted to separate out the canvas setup stuff,
 * plus other files are going to need the canvas context to
 * draw and I don't want to pass it as a param over and over
 */

const canvas = document.querySelector("canvas");

if (!canvas) {
  throw new Error("Canvas element not found!");
}

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export { canvas, ctx };
