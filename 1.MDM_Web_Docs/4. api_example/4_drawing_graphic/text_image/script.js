const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// text
ctx.strokeStyle = "black";
ctx.lineWidth = 1;
ctx.font = "36px arial";
ctx.strokeText("Canvas text", 50, 50);

ctx.fillStyle = "red";
ctx.font = "48px georgia";
ctx.fillText("Canvas text", 500, 150);

canvas.setAttribute("aria-label", "Canvas text");
//

//image 
const image = new Image();
image.src = "firefox.png";
image.addEventListener("load", () => ctx.drawImage(image, 20, 20));
ctx.drawImage(image, 20, 20, 185, 175, 50, 50, 185, 175);
canvas.setAttribute("aria-label", "Firefox Logo");

