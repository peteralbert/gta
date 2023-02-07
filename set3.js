// Definition der Kartendimensionen und Einstellungen
const colors = ["red", "green", "blue"];
const styles = ["blank", "transparent", "solid"];
const shapes = ["rectangle", "circle", "triangle"];

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
//Definition Spielbrett und Darstellung
const rows = 3;
const columns = 4;
const cardPaddings = {
  x: 0.1,
  height: 0.25,
};
// Berechnungung von Konstanten für Darstellung
const cardPatternUnselected = {
  fill: "white",
  stroke: "DimGray",
  strokeWeight: 1,
};
const cardPatternSelected = {
  fill: "gray",
  stroke: "DimGray",
  strokeWeight: 2,
};
const paddings = {
  left: 0.05,
  right: 0.25,
  top: 0.05,
  bottom: 0.05,
  betweenX: 0.05,
  betweenY: 0.05,
};
const cardWidth =
  ((1 - paddings.left - paddings.right - paddings.betweenX * (columns - 1)) /
    columns) *
  width;
const cardHeight =
  ((1 - paddings.top - paddings.bottom - paddings.betweenY * (rows - 1)) /
    rows) *
  height;

const shapeWidth = cardWidth * (1 - cardPaddings.x * 2);
const shapeHeight = cardHeight * cardPaddings.height;
console.log({ cardWidth, cardHeight, shapeWidth, shapeHeight });

// Definition der "Spielwelt"
const game = {
  allCards: [],
  unusedCards: [],
  currentCards: [],
  selectedCards: [],
  usedCards: [],
  setsFound: 0,
  errors: 0,
  setsNotFoundYet: 0,
  gameFinished: false,
};

initGame();
update();

function initGame() {
  initAllCards();
  console.log(game);
  selectInitialCards();
  console.log(game);
}

function initAllCards() {
  colors.forEach((color) => {
    styles.forEach((style) => {
      shapes.forEach((shape) => {
        for (let shapeCount = 1; shapeCount <= 3; shapeCount++) {
          const card = createCard(color, style, shape, shapeCount);
          game.allCards.push(card);
        }
      });
    });
  });
}

function createCard(color, style, shape, shapeCount) {
  return {
    id: `${color}-${style}-${shape}-${shapeCount}`,
    color,
    style,
    shape,
    shapeCount,
    rect: null,
    row: null,
    column: null,
    selected: false,
  };
}

function selectInitialCards() {
  game.unusedCards = [...game.allCards];
  game.currentCards = [];
  for (let row = 1; row <= rows; row++) {
    for (let column = 1; column <= columns; column++) {
      const randomIndex = randomInt(0, game.unusedCards.length);
      const card = game.unusedCards.splice(randomIndex, 1)[0];
      card.row = row;
      card.column = column;
      game.currentCards.push(card);
    }
  }
}

function update() {
  checkSelection();
  checkSetsNotFoundYet();
  drawGame();
}

function drawGame() {
  clear();
  drawCards();
  drawStats();
}

function drawCards() {
  game.currentCards.forEach((card) => drawCard(card));
}
function drawCard(card) {
  const { row, column, shapeCount } = card;
  const cardLeftX =
    paddings.left * width +
    (column - 1) * (cardWidth + paddings.betweenX * width);
  const cardTopY =
    paddings.top * height +
    (row - 1) * (cardHeight + paddings.betweenY * height);
  applyPattern(card.selected ? cardPatternSelected : cardPatternUnselected);
  rect(cardLeftX, cardTopY, cardWidth, cardHeight);

  const shapeLeftX = cardLeftX + cardWidth * cardPaddings.x;
  const yPadding =
    (cardHeight - shapeCount * shapeHeight) / (2 + shapeCount - 1);

  card.rect = {
    x: cardLeftX,
    y: cardTopY,
    width: cardWidth,
    height: cardHeight,
  };

  for (let i = 0; i < shapeCount; i++) {
    drawShape(card, {
      leftX: shapeLeftX,
      topY: cardTopY + yPadding + i * (yPadding + shapeHeight),
      width: shapeWidth,
      height: shapeHeight,
    });
  }
}

function drawShape(card, shapePostion) {
  const { color, shape, style } = card;
  const { leftX, topY, width, height } = shapePostion;

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

function applyPattern(pattern) {
  fill(pattern.fill ?? "white");
  stroke(pattern.stroke ?? pattern.fill ?? "black");
  strokeWeight(pattern.weight ?? 1);
}

function drawStats() {
  const x = width * (1 - paddings.right) + 10;
  fill("black");
  stroke("black");
  textSize(16);
  text(`Sets gefunden: ${game.setsFound}`, x, 30);
  text(`Fehler: ${game.errors}`, x, 60);
  text(`Noch nicht gefunden: ${game.setsNotFoundYet}`, x, 90);
}

function mousePressed() {
  const clickedCard = game.currentCards.find((card) => {
    return collisionPointRect(
      mouseX,
      mouseY,
      card.rect.x,
      card.rect.y,
      card.rect.width,
      card.rect.height
    );
  });
  if (!clickedCard) return;

  if (game.selectedCards.length === 3 && !clickedCard.selected) return;

  clickedCard.selected = !clickedCard.selected;
  if (clickedCard.selected) {
    game.selectedCards.push(clickedCard);
  } else {
    game.selectedCards = game.selectedCards.filter(
      (card) => card.id !== clickedCard.id
    );
  }
  update();
}

function checkSelection() {
  if (game.selectedCards.length !== 3) return;
  if (
    isSet(game.selectedCards[0], game.selectedCards[1], game.selectedCards[2])
  ) {
    game.setsFound++;
    game.selectedCards.forEach((card) => {
      game.usedCards.push(card);
      const nextCard = game.unusedCards.splice(
        randomInt(0, game.unusedCards.length),
        1
      )[0];
      if (!nextCard) return;
      nextCard.row = card.row;
      nextCard.column = card.column;
      game.currentCards[game.currentCards.indexOf(card)] = nextCard;
    });
  } else {
    game.errors++;
    game.selectedCards.forEach((card) => {
      card.selected = false;
    });
  }
  game.selectedCards = [];
}

function isSet(cardA, cardB, cardC) {
  for (const property of ["color", "style", "shape", "shapeCount"]) {
    const a = cardA[property];
    const b = cardB[property];
    const c = cardC[property];
    if (!(a === b && b === c) && !(a !== b && b !== c && a !== c)) return false;
  }
  return true;
}

function checkSetsNotFoundYet() {
  determineSetsNotFoundYet();
  if (game.setsNotFoundYet === 0 && game.unusedCards.length === 0) {
    alert("Gewonnen!");
    game.gameFinished = true;
  } else {
    game.gameFinished = false;
    //add 5th column
  }
}

function determineSetsNotFoundYet() {
  game.setsNotFoundYet = 0;
  for (let a = 0; a < game.currentCards.length; a++) {
    const cardA = game.currentCards[a];
    for (let b = a + 1; b < game.currentCards.length; b++) {
      const cardB = game.currentCards[b];
      for (let c = b + 1; c < game.currentCards.length; c++) {
        const cardC = game.currentCards[c];
        if (isSet(cardA, cardB, cardC)) game.setsNotFoundYet++;
      }
    }
  }
}
