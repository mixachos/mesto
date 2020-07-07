import { Card } from './Card.js';
import { Section } from './Section.js';
import { Popup } from './Popup.js';
import { PopupWithImage } from './PopupWithImage.js';
import { PopupWithForm } from './PopupWithForm.js';
import { UserInfo } from './UserInfo.js';
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
const cardTemplate = document.querySelector('#card-template').content;  //содержимое шаблона
//--

const userInfo = new UserInfo(
  '.profile__name',
  '.profile__job'
);

function addCard() {

  const item = {
    name: `${titleInput.value}`,
    link: `${linkInput.value}`,
    alt: `Фото ${titleInput.value}`
  };

  cards.addItem(renderCard(item), 'CARD');
  popupAdd.close();
}
//--

//--Собрать и вернуть карточку как экземпляр класса
function renderCard(item) {
  const card = new Card(
    item,
    cardTemplate,
    {
      handleCardClick: () => {
        popupView.open(item);
      }
    });
  const cardElement = card.generateCard();
  return cardElement;
}
//--

const cards = new Section({
  items: initialCards,
  renderer: (item) => {
    cards.addItem(renderCard(item));
  }
}, '.cards__list');
cards.renderItems();

const popupEdit = new PopupWithForm(
  '.popup_type_edit',
  {
    handleFormSubmit: (evt) => {
      evt.preventDefault();
      const inputValues = {
        name: nameInput.value,
        job: jobInput.value
      }
      const pageElements = {
        nameElement,
        jobElement
      }
      console.log(inputValues);
      console.log(pageElements);

      userInfo.setUserInfo(inputValues, pageElements);
      popupEdit.close();
    }
  });

const popupAdd = new PopupWithForm(
  '.popup_type_add',
  {
    handleFormSubmit: (evt) => {
      evt.preventDefault();
      addCard();
    }
  });
const popupView = new PopupWithImage('.popup_type_view');

editButton.addEventListener('click', () => {
  const pageValues = userInfo.getUserInfo();

  nameInput.value = pageValues.nameInput;
  jobInput.value = pageValues.jobInput;

  popupEdit.open();
});
addButton.addEventListener('click', () => {
  popupAdd.open();
});

popupEdit.setEventListeners();
popupAdd.setEventListeners();
popupView.setEventListeners();

//--Подключить валидацию форм
const editForm = new FormValidator(options, popupElementEdit);
const addForm = new FormValidator(options, popupElementAdd);
editForm.enableValidation();
addForm.enableValidation();
//--

export { popupElementView, imageElement, captionElement };
