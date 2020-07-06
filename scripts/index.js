import { Card } from './Card.js';
import { Section } from './Section.js';
import { Popup } from './Popup.js';
import { FormValidator } from './FormValidator.js';
import { initialCards, options } from './data.js';

//--Находим блоки
const profileElement = document.querySelector('.profile');
const popupElementEdit = document.querySelector('.popup_type_edit');
const popupElementAdd = document.querySelector('.popup_type_add');
const popupElementView = document.querySelector('.popup_type_view');
//--

//--Элементы на странице
const editButton = profileElement.querySelector('.profile__edit-button');
const addButton = profileElement.querySelector('.profile__add-button');
const nameElement = profileElement.querySelector('.profile__name');
const jobElement = profileElement.querySelector('.profile__job');
//--

//--Элементы формы edit
const closeButtonEdit = popupElementEdit.querySelector('.popup__close-button');
const nameInput = popupElementEdit.querySelector('.popup__input_type_name');
const jobInput = popupElementEdit.querySelector('.popup__input_type_job');
//--

//--Элементы формы add
const closeButtonAdd = popupElementAdd.querySelector('.popup__close-button');
const titleInput = popupElementAdd.querySelector('.popup__input_type_title');
const linkInput = popupElementAdd.querySelector('.popup__input_type_link');
//--

//--Элементы формы view
const closeButtonView = popupElementView.querySelector('.popup__close-button');
const imageElement = popupElementView.querySelector('.popup__image');
const captionElement = popupElementView.querySelector('.popup__image-caption');
//--

//--Шаблон карточки
const cardsList = document.querySelector('.cards__list');  //выбрали контейнер для добавления в него карточек
const cardTemplate = document.querySelector('#card-template').content;  //содержимое шаблона
//--

//--Инициализация страницы. Создать карточки как экземпляры класса, беря данные из массива
/*function initPage() {
  initialCards.forEach((item) => {
    cardsList.append(renderCard(item));
  });
}*/
//--

//--Инициализация формы edit, считываем значения со страницы
function initPopupEdit() {
  nameInput.value = nameElement.textContent;
  jobInput.value = jobElement.textContent;
}
//--

//--Записываем значения из формы edit на страницу
function editProfile(evt) {
  evt.preventDefault();

  nameElement.textContent = nameInput.value;
  jobElement.textContent = jobInput.value;

  popupOpenClose(popupElementEdit);
}
//--

//--Обработка нажатия esc, закрытие попапа
/*function popupCloseOnEsc(evt) {
  if (evt.key === 'Escape') {
    const popup = document.querySelector('.popup_opened');
    popup.classList.remove('popup_opened');
  }
}*/
//--

//--Обработка щелчка на оверлее для закртыия попапа
function setPopupEventListeners() {
  const popupList = Array.from(document.querySelectorAll('.popup'));  //собрали все попапы
  popupList.forEach((popupElement) => {
    popupElement.addEventListener('click', (evt) => { //каждому попапу добавили слушатель
      const isPopupOverlayClicked = evt.target.classList.contains('popup'); //если щёлкнули по оверлею, закрыть попап
      if (isPopupOverlayClicked) {
        popupOpenClose(popupElement);
      }
    });
  });
}
//--

//--Управляем видимостью формы
function popupOpenClose(popup) {
  popup.classList.toggle('popup_opened'); //поменяли состояние попапа

  const isPopupOpened = popup.classList.contains('popup_opened'); //при открытии - true

  if (isPopupOpened) {
    document.addEventListener('keydown', popupCloseOnEsc, { once: true });
    //если попап открыт, обрабатывать нажатие клавиш. Снимать автоматом (если нажата "esc"), чтобы не прописывать снятие в колбэке

    //скрыть ошибки при открытии попапа
    editForm.clearInputError();
    addForm.clearInputError();

  } else {
    document.removeEventListener('keydown', popupCloseOnEsc); //снять слушатель при закрытии, если закрыто не по "esc"
  }
}
//--

//--Добавить карточку на страницу из формы add
function addCard(evt) {
  evt.preventDefault();

  const item = {
    name: `${titleInput.value}`,
    link: `${linkInput.value}`,
    alt: `Фото ${titleInput.value}`
  };

  //cardsList.prepend(renderCard(item));
 cards.addItem(renderCard(item), 'CARD');


  popupOpenClose(popupElementAdd);
}
//--

//--Собрать и вернуть карточку как экземпляр класса
function renderCard(item) {
  const card = new Card(item, cardTemplate);
  const cardElement = card.generateCard();
  return cardElement;
}
//--

//initPage(); //Инициализация страницы, загрузка карточек из массива


const cards = new Section ({
  items: initialCards,
  renderer: (item) => {
    //const card = new Card(item, cardTemplate);
    //const cardElement = card.generateCard();
    //cards.addItem(cardElement);
    cards.addItem(renderCard(item));
  }
}, '.cards__list');
cards.renderItems();


//setPopupEventListeners();

//--Обрабатываем нажатия по кнопкам
const popupEdit = new Popup('.popup_type_edit');
const popupAdd = new Popup('.popup_type_add');
const popupView = new Popup('.popup_type_view');

editButton.addEventListener('click', () => {
  initPopupEdit();
  popupEdit.open();
});
addButton.addEventListener('click', () => {
  titleInput.value = '';
  linkInput.value = '';

  //popupOpenClose(popupElementAdd);
  popupAdd.open();
});

popupEdit.setEventListeners(closeButtonEdit);
popupAdd.setEventListeners(closeButtonAdd);
//closeButtonEdit.addEventListener('click', () => { popupEdit.close() });
//closeButtonAdd.addEventListener('click', () => { popupOpenClose(popupElementAdd) });
closeButtonView.addEventListener('click', () => { popupOpenClose(popupElementView) });

popupElementAdd.addEventListener('submit', addCard);
popupElementEdit.addEventListener('submit', editProfile);
//--

//--Подключить валидацию форм
const editForm = new FormValidator(options, popupElementEdit);
const addForm = new FormValidator(options, popupElementAdd);
editForm.enableValidation();
addForm.enableValidation();
//--

export { popupOpenClose, popupElementView, imageElement, captionElement };
