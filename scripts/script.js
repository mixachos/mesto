//--Находим блоки
const profileElement = document.querySelector('.profile');
const popupElement = document.querySelector('.popup');
//--

//--Элементы на странице
const editButton = profileElement.querySelector('.profile__edit-button');
const addButton = profileElement.querySelector('.profile__add-button');
const nameElement = profileElement.querySelector('.profile__name');
const jobElement = profileElement.querySelector('.profile__job');
//--

//--Элементы формы
const closeButton = popupElement.querySelector('.popup__close-button');
const saveButton = popupElement.querySelector('.popup__save-button');
const nameInput = popupElement.querySelector('.popup__input-name');
const jobInput = popupElement.querySelector('.popup__input-job');
//--

//--Инициализация формы, считываем значения со страницы
function formInit () {
  nameInput.value = nameElement.textContent;
  jobInput.value = jobElement.textContent;
}
//--

//--Записываем значения из формы на страницу
function formSubmitHandler (evt) {
  evt.preventDefault();

  nameElement.textContent = nameInput.value;
  jobElement.textContent = jobInput.value;
}
//--

//--Управляем видимостью формы, при открытии - инициализация
function popupOpenClose() {
  if (popupElement.classList.contains('.popup__opened') !== true) {
    formInit();
  }
  popupElement.classList.toggle('popup_opened');
}
//--

//--Обрабатываем нажатия по кнопкам
editButton.addEventListener('click', popupOpenClose);
closeButton.addEventListener('click', popupOpenClose);
popupElement.addEventListener('submit', formSubmitHandler);
//--

