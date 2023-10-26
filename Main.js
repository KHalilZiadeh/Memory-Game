let allSymbols = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "~",
  "+",
  "=",
  ":",
  ";",
  "÷",
];
let gameSymbols = new Set();
let cardsContent = [];
let numberOfCards;
let gridDimensions;
let gameCards;
let pickedSymbol;
let gridWidth;
let gridHeight;

if (window.innerWidth < 376) {
  gridWidth = 355;
} else {
  gridWidth = 600;
}
gridHeight = gridWidth;

let aside = document.querySelector("aside");
let levels = document.querySelectorAll("aside div");
let cards = document.querySelector(".cards");
let rstBtn = document.querySelector("button");

function selectSymbols() {
  cardsContent = [];
  while (gameSymbols.size != numberOfCards / 2) {
    let symbole = allSymbols[Math.floor(Math.random() * allSymbols.length)];

    if (!gameSymbols.has(symbole)) {
      gameSymbols.add(symbole);
    }
  }

  while (cardsContent.length != numberOfCards) {
    let gameSymbolsArray = Array.from(gameSymbols);
    symbole = gameSymbolsArray[Math.floor(Math.random() * gameSymbols.size)];

    if (!cardsContent.includes(symbole)) {
      cardsContent.push(symbole);
    } else {
      cardsContent.push(symbole);
      gameSymbols.delete(symbole);
    }
  }
}

function updateCardsNumber() {
  if (sessionStorage.length > 2) {
    numberOfCards = sessionStorage.getItem("numberOfCards");
    gridDimensions = sessionStorage.getItem("gridDimensions");
  } else {
    numberOfCards = 8;
    gridDimensions = 3;
  }
}

function updateNumberOnClick(e) {
  numberOfCards = e.currentTarget.dataset.number;
  gridDimensions = e.currentTarget.dataset.grid;
  sessionStorage.setItem("numberOfCards", numberOfCards);
  sessionStorage.setItem("gridDimensions", gridDimensions);
}

function addCards() {
  cards.innerHTML = "";

  let cardDimensions = (gridWidth - (gridDimensions - 1) * 10) / gridDimensions;
  cards.style.gridTemplateColumns = `repeat(${gridDimensions}, 1fr`;
  cards.style.gridTemplateRows = `repeat(${gridDimensions}, 1fr`;

  for (let i = 0; i < cardsContent.length + 1; i++) {
    let card = document.createElement("div");
    let span = document.createElement("span");
    card.style.width = `${cardDimensions}px`;
    card.style.height = `${cardDimensions}px`;

    if (i < numberOfCards / 2 && numberOfCards != 16) {
      card.classList.add("card");
      card.setAttribute("data-symbol", `${cardsContent[i]}`);
      span.append(document.createTextNode("?"));
      card.append(span);
    } else if (i > numberOfCards / 2 && numberOfCards != 16) {
      card.classList.add("card");
      card.setAttribute("data-symbol", `${cardsContent[i - 1]}`);
      span.append(document.createTextNode("?"));
      card.append(span);
    } else if (numberOfCards == 16) {
      if (document.querySelectorAll(".card").length == 16) break;
      card.classList.add("card");
      card.setAttribute("data-symbol", `${cardsContent[i]}`);
      span.append(document.createTextNode("?"));
      card.append(span);
    }
    cards.append(card);
  }
  gameCards = document.querySelectorAll(".card");
}

function updateLevel() {
  let height;
  numberOfCards == 8
    ? (height = 33)
    : numberOfCards == 16
    ? (height = 66)
    : (height = 100);

  aside.style.setProperty("--indi", `${height}%`);
}

updateCardsNumber();
selectSymbols();
addCards();
addEventlistners();
updateLevel();

levels.forEach((level) => {
  level.addEventListener("click", (e) => {
    updateNumberOnClick(e);
    selectSymbols();
    addCards();
    addEventlistners();
    updateLevel();
  });
});

rstBtn.addEventListener("click", () => {
  pickedSymbol = null;
  location.reload();
});

function addEventlistners() {
  gameCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      card.firstChild.innerHTML = e.currentTarget.dataset.symbol;
      e.currentTarget.classList.add("for-now");
      e.currentTarget.firstChild.classList.add("clicked", "for-now");
      if (pickedSymbol == null) {
        e.currentTarget.classList.add("clicked");
        pickedSymbol = e.currentTarget.dataset.symbol;
      } else if (
        pickedSymbol == e.currentTarget.dataset.symbol &&
        !e.currentTarget.classList.contains("clicked")
      ) {
        pickedSymbol = null;
        e.currentTarget.classList.add("clicked");
        document.querySelectorAll(".card.clicked").forEach((click) => {
          click.classList.remove("for-now");
          click.firstChild.classList.remove("for-now");
          click.classList.add("correct");
        });
      } else if (
        pickedSymbol != e.currentTarget.dataset.symbol &&
        !e.currentTarget.classList.contains("clicked")
      ) {
        e.currentTarget.classList.add("clicked");
        pickedSymbol = null;
        setTimeout(() => {
          document.querySelectorAll("div.for-now").forEach((one) => {
            one.classList.remove("for-now", "clicked");
          });
          for (let i = 0; i < 2; i++) {
            document.querySelectorAll("span.for-now").forEach((span) => {
              console.log(span);
              span.classList.remove("clicked", "for-now");
              span.innerHTML = "?";
            });
          }
        }, 500);
      }
    });
  });
}
