const canvas = document.querySelector("canvas");

if (!canvas) {
  throw new Error("Canvas element not found!");
}

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export { canvas, ctx };
