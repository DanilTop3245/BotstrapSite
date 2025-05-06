const openBtn = document.getElementById("addCard");
const closeBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");
const saveCardBtn = document.getElementById("saveCardBtn");
const colorInput = document.getElementById("colorInput");
const textInput = document.getElementById("textInput");
const fileInput = document.getElementById("fileInput");
const flipCardsContainer = document.querySelector(".flip-cards");
const maxFileSize = 100 * 1024;

let cardsData = JSON.parse(localStorage.getItem("cardsData")) || [
  { imgSrc: "assets/cabin.png", text: "Карточка 1" },
  { imgSrc: "assets/cake.png", text: "Карточка 2" },
  { imgSrc: "assets/circus.png", text: "Карточка 3" },
  { imgSrc: "assets/game.png", text: "Карточка 4" },
  { imgSrc: "assets/safe.png", text: "Карточка 5" },
  { imgSrc: "assets/submarine.png", text: "Карточка 6" },
];

const countCards = cardsData.length;

function saveToLocalStorage() {
  localStorage.setItem("cardsData", JSON.stringify(cardsData));
}

// open modal
openBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

// close modal
closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// create card
function createCard(card, index) {
  const cardEl = document.createElement("div");
  cardEl.className = "col-md-6 col-lg-4 p-2 rounded text-center mb-5 flip-card";
  cardEl.innerHTML = `
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img class="img-fluid rounded mb-2" src="${card.imgSrc}" alt="...">
      </div>
      <div class="flip-card-back" style="background-color: ${
        card.color || "#343a40"
      }">
        <p class="fs-6 lh-1 text-white p-3">${card.text}</p>
      </div>
    </div>
    <button class="btn mt-1 btn-primary btn-add delete-card-btn" data-index="${index}">
      Delete
    </button>
  `;
  return cardEl;
}

// render cards
function renderCards() {
  flipCardsContainer.innerHTML = "";
  cardsData.forEach((card, index) => {
    const cardEl = createCard(card, index);
    flipCardsContainer.appendChild(cardEl);
  });
  openBtn.disabled = cardsData.length >= 9;
}

// delete card
flipCardsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-card-btn")) {
    const index = e.target.getAttribute("data-index");
    cardsData.splice(index, 1);
    saveToLocalStorage();
    renderCards();
  }
});

// disable file input if catApi is selected
document.querySelectorAll('input[name="imageOption"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    fileInput.disabled = document.getElementById("catApiOption").checked;
  });
});

// add new card
saveCardBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();
  const file = fileInput.files[0];
  const color = colorInput.value;
  const selectedOption = document.querySelector(
    'input[name="imageOption"]:checked'
  ).value;

  let imgSrc;

  if (selectedOption === "catApi") {
    try {
      const config = await fetch("/BotstrapSite/config/config.json").then((r) =>
        r.json()
      );
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search",
        {
          headers: { "x-api-key": config.API_KEY },
        }
      );
      const catData = await response.json();
      imgSrc = catData[0].url;
    } catch (error) {
      alert("Не удалось загрузить котика 😿");
      console.error(error);
      return;
    }
  } else {
    if (!file) {
      alert("Выберите изображение!");
      return;
    }

    if (file.size > maxFileSize) {
      alert("Файл слишком большой! Загрузите изображение меньше 100 КБ.");
      return;
    }

    imgSrc = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const newCard = {
    imgSrc,
    text,
    color,
  };

  cardsData.push(newCard);
  saveToLocalStorage();
  renderCards();
  modal.classList.remove("show");

  // clear fields
  textInput.value = "";
  fileInput.value = "";
  colorInput.value = "#000000";
});

// first draw
renderCards();
