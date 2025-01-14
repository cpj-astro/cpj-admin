import React, { useEffect } from "react";

function drawHouse(context, points) {
  context.beginPath();
  points.forEach(([x, y]) => {
    context.lineTo(x * context.canvas.width / 100, y * context.canvas.height / 100);
  });
  context.closePath();
  context.lineWidth = 1;
  context.strokeStyle = '#666666';
  context.stroke();
}

function drawText(context, x, y, maintext, subtext) {
  context.font = "16px Comic Sans MS";
  context.fillStyle = "black"; // Change the text color to black
  context.fillText(maintext, x * context.canvas.width / 100, y * context.canvas.height / 100);
}

const CreateKundli = () => {
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const houses = [
      { points: [[50, 0], [75, 25], [50, 50], [25, 25]], text: { x: 50, y: 25, main: "1", sub: "subtext" } },
      { points: [[0, 0], [50, 0], [25, 25]], text: { x: 25, y: 12, main: "2", sub: "subtext" } },
      { points: [[0, 0], [25, 25], [0, 50]], text: { x: 12, y: 25, main: "3", sub: "subtext" } },
      { points: [[25, 25], [50, 50], [25, 75], [0, 50]], text: { x: 25, y: 50, main: "4", sub: "subtext" } },
      { points: [[0, 50], [25, 75], [0, 100]], text: { x: 12, y: 75, main: "5", sub: "subtext" } },
      { points: [[25, 75], [50, 100], [0, 100]], text: { x: 25, y: 88, main: "6", sub: "subtext" } },
      { points: [[50, 50], [75, 75], [50, 100], [25, 75]], text: { x: 50, y: 75, main: "7", sub: "subtext" } },
      { points: [[75, 75], [100, 100], [50, 100]], text: { x: 75, y: 88, main: "8", sub: "subtext" } },
      { points: [[75, 75], [100, 50], [100, 100]], text: { x: 88, y: 75, main: "9", sub: "subtext" } },
      { points: [[75, 25], [100, 50], [75, 75], [50, 50]], text: { x: 75, y: 50, main: "10", sub: "subtext" } },
      { points: [[100, 0], [100, 50], [75, 25]], text: { x: 88, y: 25, main: "11", sub: "subtext" } },
      { points: [[50, 0], [100, 0], [75, 25]], text: { x: 75, y: 12, main: "12", sub: "subtext" } },
    ];

    houses.forEach((house) => {
      drawHouse(ctx, house.points);
      drawText(ctx, house.text.x, house.text.y, house.text.main, house.text.sub);
    });
  }, []);

  return (
    <canvas id="canvas" width={700} height={500}></canvas>
  );
};

export default CreateKundli;
