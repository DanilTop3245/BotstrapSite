let addCardBtn = document.getElementById("addCard");

const openBtn = document.getElementById("addCard");
const closeBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => {
  modal.classList.add("show"); // показываем модалку
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show"); // скрываем модалку
});

// чтобы клик вне модалки закрывал её
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

function markupModal() {
    return `
        <div id="modal" class="modal">
          <div class="modal-content">
            <p>Это модалка!</p>
            <button id="closeModalBtn">Закрыть</button>
          </div>
        </div>
    `;
}