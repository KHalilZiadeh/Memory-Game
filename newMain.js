console.time("all");
let allSymbols = [
  "~",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "-",
  "=",
  "+",
  ":",
  ";",
  "÷",
  "|",
  "؛",
];

// Variables
let symbols = new Set();
let symbolsArray = [];
let cardsArea;
let cardsNumber;
let rowsNumber;
let cardDimensions;
let cards;
let duration = 1000;

// DOM Elements
let cardsContainer = document.querySelector(".cards");
let rstBtn = document.querySelector("button");
let levels = document.querySelectorAll("aside div");
let aside = document.querySelector("aside");

function getLevel() {
  if (
    sessionStorage.getItem("cardsNumber") &&
    sessionStorage.getItem("rowsNumber")
  ) {
    cardsNumber = sessionStorage.getItem("cardsNumber");
    rowsNumber = sessionStorage.getItem("rowsNumber");
  } else {
    cardsNumber = 8;
    rowsNumber = 3;
  }
}

function getLevelOnClick(e) {
  cardsNumber = e.target.dataset.number;
  sessionStorage.setItem("cardsNumber", cardsNumber);

  rowsNumber = e.target.dataset.grid;
  sessionStorage.setItem("rowsNumber", rowsNumber);
}

function createGrid() {
  if (window.innerWidth > 1080) {
    cardsArea = 600;
  } else {
    cardsArea = window.innerWidth - 20;
  }

  cardsContainer.style.gridTemplateColumns = `repeat(${rowsNumber}, 1fr)`;
  cardsContainer.style.gridTemplaterows = `repeat(${rowsNumber}, 1fr)`;

  cardDimensions = (cardsArea - (rowsNumber - 1) * 10) / rowsNumber;
}

function fillSet(number) {
  while (symbols.size != number) {
    let symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
    if (!symbols.has(symbol)) {
      symbols.add(symbol);
    }
  }
}

function createSymbolsArray(set) {
  let setArray = Array.from(set);

  while (symbolsArray.length != cardsNumber) {
    let index = Math.floor(Math.random() * (cardsNumber / 2));
    let randomSymobl = setArray[index];
    if (!symbolsArray.includes(randomSymobl)) {
      symbolsArray.push(randomSymobl);
    } else if (
      symbolsArray.indexOf(randomSymobl) ==
      symbolsArray.lastIndexOf(randomSymobl)
    ) {
      symbolsArray.push(randomSymobl);
      set.delete(randomSymobl);
    }
  }
}

function createCards(content) {
  cardsContainer.innerHTML = "";

  for (let i = 0; i < content.length + 1; i++) {
    let div = document.createElement("div");
    div.style.width = `${cardDimensions}px`;
    div.style.height = `${cardDimensions}px`;
    let span = document.createElement("span");

    if (cardsNumber == 16) {
      if (document.querySelectorAll(".card").length == 16) break;
      div.classList.add("card");
      div.setAttribute("data-symbol", `${content[i]}`);
      span.innerHTML = `?`;
      div.append(span);
    } else if (i < cardsNumber / 2) {
      div.classList.add("card");
      div.setAttribute("data-symbol", `${content[i]}`);
      span.innerHTML = `?`;
      div.append(span);
    } else if (i > cardsNumber / 2) {
      div.classList.add("card");
      div.setAttribute("data-symbol", `${content[i - 1]}`);
      span.innerHTML = `?`;
      div.append(span);
    }

    div.append(span);
    cardsContainer.append(div);
  }
  cards = document.querySelectorAll(".card");
  symbolsArray = [];
}

function onStart() {
  cards.forEach((card) => {
    addFlipped(card);
  });
  setTimeout(() => {
    cards.forEach((card) => {
      removeFlipped(card);
    });
  }, 2000);
}

function updatelevel() {
  let indi;

  cardsNumber == 8
    ? (indi = 33)
    : cardsNumber == 16
    ? (indi = 66)
    : (indi = 100);

  aside.style.setProperty("--indi", `${indi}%`);
}

function addFlipped(e) {
  e.classList.add("flipped");
  e.firstChild.classList.add("flipped");
  e.firstChild.innerHTML = `${e.dataset.symbol}`;
}
function addFlippedOnclick(e) {
  e.currentTarget.classList.add("flipped");
  e.currentTarget.firstChild.classList.add("flipped");
  e.currentTarget.firstChild.innerHTML = `${e.currentTarget.dataset.symbol}`;
}

function removeFlipped(e) {
  e.classList.remove("flipped");
  e.firstChild.classList.remove("flipped");
  e.classList.contains("correct")
    ? (e.firstChild.innerHTML = `${e.dataset.symbol}`)
    : (e.firstChild.innerHTML = `?`);
}

function checkMatch(cardOne, cardTwo) {
  if (cardOne.dataset.symbol === cardTwo.dataset.symbol) {
    cardOne.classList.add("correct");
    cardTwo.classList.add("correct");
    removeFlipped(cardOne);
    removeFlipped(cardTwo);
    cardsContainer.classList.remove("no-click");
  } else {
    setTimeout(() => {
      removeFlipped(cardOne);
      removeFlipped(cardTwo);
      cardsContainer.classList.remove("no-click");
    }, duration);
  }
}

getLevel();
updatelevel();
createGrid();
fillSet(cardsNumber / 2);
createSymbolsArray(symbols);
createCards(symbolsArray);
onStart();

rstBtn.addEventListener("click", () => {
  location.reload();
});

levels.forEach((level) => {
  level.addEventListener("click", (e) => {
    getLevelOnClick(e);
    updatelevel();
    createGrid();
    fillSet(cardsNumber / 2);
    createSymbolsArray(symbols);
    createCards(symbolsArray);
    onStart();
  });
});

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    addFlipped(e);
    if (document.querySelectorAll("div.flipped").length == 2) {
      cardsContainer.classList.add("no-click");
      checkMatch(
        document.querySelectorAll("div.flipped")[0],
        document.querySelectorAll("div.flipped")[1]
      );
    }
  });
});