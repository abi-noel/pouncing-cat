var canvas = document.querySelector("canvas");
if (!canvas) {
    throw new Error("Canvas element not found!");
}
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
export { canvas, ctx };
