const colors = ["red", "green", "blue"];
const styles = ["blank", "transparent", "solid"];
const shapes = ["rectangle", "circle", "triangle"];

const cards = [];
colors.forEach((color) => {
  styles.forEach((style) => {
    shapes.forEach((shape) => {
      for (let shapeCount = 1; shapeCount <= 3; shapeCount++) {
        const card = {
          style,
          color,
          shape,
          shapeCount,
        };
        cards.push(card);
      }
    });
  });
})

for (let style = 1; style <= 3; style++) {
  for (let color = 0; color < 3; color++) {
    for (let shape = 0; shape < 3; shape++) {
      for (let shapeCount = 1; shapeCount <= 3; shapeCount++) {
        const card = {
          style: styles[style - 1],
          color: colors[color],
          shape: shapes[shape],
          shapeCount: shapeCount,
        };
        cards.push(card);
      }
    }
  }
    
    const card = {
      style: styles[style - 1],
      color: colors[color],
      shapes: ...,
      shapeCount: ...,
    }
    cards.push(card)
  }
}

const patterns = {
  solid: {
    red: { fill: "OrangeRed", stroke: "OrangeRed", strokeWeight: 0 },
    green: {
      fill: "DarkOliveGreen",
      stroke: "DarkOliveGreen",
      strokeWeight: 0,
    },
    blue: { fill: "DarkCyan", stroke: "DarkCyan", strokeWeight: 0 },
  },
  transparent: {
    red: { fill: "PeachPuff", stroke: "PeachPuff", strokeWeight: 0 },
    green: { fill: "Khaki", stroke: "Khaki", strokeWeight: 0 },
    blue: { fill: "LightCyan", stroke: "LightCyan", strokeWeight: 0 },
  },
  blank: {
    red: { fill: "white", stroke: "OrangeRed", strokeWeight: 2 },
    green: { fill: "white", stroke: "DarkOliveGreen", strokeWeight: 2 },
    blue: { fill: "white", stroke: "DarkCyan", strokeWeight: 2 },
  },
};
const cardPattern = { fill: "white", stroke: "black", strokeWeight: 1 };
const paddings = {
  left: 0.05,
  right: 0.25,
  top: 0.05,
  bottom: 0.05,
  betweenX: 0.05,
  betweenY: 0.05,
};
const rows = 3;
const columns = 4;
const cardWidth =
  ((1 - paddings.left - paddings.right - paddings.betweenX * (columns - 1)) /
    columns) *
  width;
const cardHeight =
  ((1 - paddings.top - paddings.bottom - paddings.betweenY * (rows - 1)) /
    rows) *
  height;

const cardPaddings = {
  x: 0.1,
  height: 0.25,
};
const shapeWidth = cardWidth * (1 - cardPaddings.x * 2);
const shapeHeight = cardHeight * cardPaddings.height;

for (let row = 1; row <= rows; row++) {
  for (let column = 1; column <= columns; column++) {
    const card = {
      color: colors[randowmInt(0, 2)],
      style: styles[(column - 1) % 3],
      shape: shapes[row - 1],
      shapeCount: randomInt(1, 3)),
    };
    console.log(card);
    drawCard(card, { row, column });
  }
}


function drawCard({ color, style, shape, shapeCount }, { row, column }) {
  const cardLeftX =
    paddings.left * width +
    (column - 1) * (cardWidth + paddings.betweenX * width);
  const cardTopY =
    paddings.top * height +
    (row - 1) * (cardHeight + paddings.betweenY * height);
  applyPattern(cardPattern);
  rect(cardLeftX, cardTopY, cardWidth, cardHeight);

  const shapeLeftX = cardLeftX + cardWidth * cardPaddings.x;
  const yPadding =
    (cardHeight - shapeCount * shapeHeight) / (2 + shapeCount - 1);

  for (let i = 0; i < shapeCount; i++) {
    drawShape(
      { color, style, shape },
      {
        leftX: shapeLeftX,
        topY: cardTopY + yPadding + i * (yPadding + shapeHeight),
        width: shapeWidth,
        height: shapeHeight,
      }
    );
  }
}

function drawShape({ color, shape, style }, { leftX, topY, width, height }) {
  applyPattern(patterns[style][color]);

  switch (shape) {
    case "rectangle":
      rect(leftX, topY, width, height);
      break;
    case "circle":
      ellipse(leftX + width / 2, topY + height / 2, width, height);
      break;
    case "triangle":
      triangle(
        leftX,
        topY + height,
        leftX + width / 2,
        topY,
        leftX + width,
        topY + height
      );
      break;
  }
}

function applyPattern({ fill: f, stroke: s, strokeWeight: w }) {
  fill(f);
  stroke(s);
  strokeWeight(w);
}
