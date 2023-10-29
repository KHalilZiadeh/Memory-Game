// Variables
let imgs = new Set();
let imgsArray = [];
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

let sOrientation = window.matchMedia("(orientation: portrait)");

sOrientation.addEventListener("change", (e) => {
  updateCardDimension(e.matches);
  createGrid();
  cards.forEach((card) => {
    card.style.width = `${cardDimensions}px`;
    card.style.height = `${cardDimensions}px`;
  });
});

function updateCardDimension(bol) {
  if (bol) {
    cardsContainer.style.width = `${innerWidth - 20}px`;
    cardsContainer.style.height = `${innerWidth - 20}px`;
    cardDimensions = (innerWidth - 20 - (rowsNumber - 1) * 10) / rowsNumber;
  } else {
    cardsContainer.style.width = `${innerHeight * 0.9 - 20}px`;
    cardsContainer.style.height = `${innerHeight * 0.9 - 20}px`;
    cardDimensions =
      (innerHeight * 0.9 - 20 - (rowsNumber - 1) * 10) / rowsNumber;
  }
}

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
  cardsContainer.style.gridTemplateColumns = `repeat(${rowsNumber}, 1fr)`;
  cardsContainer.style.gridTemplaterows = `repeat(${rowsNumber}, 1fr)`;
}

function fillSet(number) {
  while (imgs.size != number) {
    let index = Math.floor(Math.random() * 21) + 1;
    if (!imgs.has(index)) {
      imgs.add(index);
    }
  }
}

function createSymbolsArray(set) {
  let setArray = Array.from(set);

  while (imgsArray.length != cardsNumber) {
    let index = Math.floor(Math.random() * (cardsNumber / 2));
    let randomNumber = setArray[index];
    if (!imgsArray.includes(randomNumber)) {
      imgsArray.push(randomNumber);
    } else if (
      imgsArray.indexOf(randomNumber) == imgsArray.lastIndexOf(randomNumber)
    ) {
      imgsArray.push(randomNumber);
      set.delete(randomNumber);
    }
  }
}

function createCards(content) {
  cardsContainer.innerHTML = "";

  for (let i = 0; i < content.length + 1; i++) {
    let div = document.createElement("div");
    div.style.width = `${cardDimensions}px`;
    div.style.height = `${cardDimensions}px`;

    if (content.length == 16 || i < cardsNumber / 2) {
      if (i == 16) break;
      div.classList.add("card");

      let img = document.createElement("img");
      img.src = `./Assets/${content[i]}.png`;

      let back = document.createElement("div");
      back.classList.add("back");
      back.innerHTML = "?";

      div.append(img, back);
    } else if (i > cardsNumber / 2) {
      div.classList.add("card");

      let img = document.createElement("img");
      img.src = `./Assets/${content[i - 1]}.png`;

      let back = document.createElement("div");
      back.classList.add("back");
      back.innerHTML = "?";

      div.append(img, back);
    }

    cardsContainer.append(div);
  }

  cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      addFlippedOnclick(e);
      if (document.querySelectorAll("div.flipped").length == 2) {
        cardsContainer.classList.add("no-click");
        checkMatch(
          document.querySelectorAll(".card.flipped")[0],
          document.querySelectorAll(".card.flipped")[1]
        );
      }
    });
  });

  imgsArray = [];
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
}

function addFlippedOnclick(e) {
  e.currentTarget.classList.add("flipped");
}

function removeFlipped(e) {
  e.classList.remove("flipped");
}

function checkMatch(cardOne, cardTwo) {
  console.log(cardOne.firstChild.src);
  console.log(cardTwo.firstChild.src);
  if (cardOne.firstChild.src === cardTwo.firstChild.src) {
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
updateCardDimension(sOrientation.matches);
createGrid();
fillSet(cardsNumber / 2);
createSymbolsArray(imgs);
createCards(imgsArray);
onStart();

rstBtn.addEventListener("click", () => {
  location.reload();
});

levels.forEach((level) => {
  level.addEventListener("click", (e) => {
    getLevelOnClick(e);
    updatelevel();
    updateCardDimension(sOrientation.matches);
    createGrid();
    fillSet(cardsNumber / 2);
    createSymbolsArray(imgs);
    createCards(imgsArray);
    onStart();
  });
});
