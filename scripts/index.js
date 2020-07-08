import { Card } from './Card.js';
import { Section } from './Section.js';
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
//--

//--Элементы формы edit
const nameInput = popupElementEdit.querySelector('.popup__input_type_name');
const jobInput = popupElementEdit.querySelector('.popup__input_type_job');
//--

//--Элементы формы add
const titleInput = popupElementAdd.querySelector('.popup__input_type_title');
const linkInput = popupElementAdd.querySelector('.popup__input_type_link');
//--

//--Элементы формы view
const imageElement = popupElementView.querySelector('.popup__image');
const captionElement = popupElementView.querySelector('.popup__image-caption');
//--

//--Шаблон карточки
const cardTemplate = document.querySelector('#card-template').content;  //содержимое шаблона
//--

//--Для сбора и записи данных через форму редактирования
const userInfo = new UserInfo(
  {
    nameElement: '.profile__name',
    jobElement: '.profile__job'
  }
);
//--

//--Собрать и вернуть карточку как экземпляр класса
function renderCard(item) {
  const card = new Card(
    item,
    cardTemplate,
    {
      handleCardClick: () => {  //при клике на картинке открывать попап просмотра и передавать туда данные
        popupView.open(item);
      }
    });
  const cardElement = card.generateCard();
  return cardElement;
}
//--

//--Инициализация страницы
const cards = new Section({
  items: initialCards, //массив с данными
  renderer: (item) => { //собрать карточку и вставить разметку в список, определённый селектором
    cards.addItem(renderCard(item));
  }
}, '.cards__list');
cards.renderItems();  //проходит по всему массиву
//--

//--Попап с формой редактирования профиля
const popupEdit = new PopupWithForm(
  '.popup_type_edit',
  {
    handleFormSubmit: (evt) => {  //при сабмите
      evt.preventDefault();
      const inputValues = { //взять данные из полей формы
        name: nameInput.value,
        job: jobInput.value
      }

      userInfo.setUserInfo(inputValues); //установить на странице новые значения
      popupEdit.close();
    }
  });
//--

//--Попап с формой добавления карточки
const popupAdd = new PopupWithForm(
  '.popup_type_add',
  {
    handleFormSubmit: (evt) => {  //при сабмите
      evt.preventDefault();
      const item = {  //взять данные из полей
        name: `${titleInput.value}`,
        link: `${linkInput.value}`,
        alt: `Фото ${titleInput.value}`
      };

      cards.addItem(renderCard(item), 'CARD');  //добавить карточку в начало списка
      popupAdd.close();
    }
  });

//--Попап с просмотром картинки
const popupView = new PopupWithImage('.popup_type_view');
//--

//--Слушатели на кнопки, для открытия попапов
editButton.addEventListener('click', () => {
  const pageValues = userInfo.getUserInfo();  //взять данные со страницы

  nameInput.value = pageValues.nameInput; //установить новые значения полям формы
  jobInput.value = pageValues.jobInput;

  popupEdit.open();
});

addButton.addEventListener('click', () => {
  popupAdd.open();
});
//--

//--Слушатели на попапы
popupEdit.setEventListeners();
popupAdd.setEventListeners();
popupView.setEventListeners();
//--

//--Подключить валидацию форм
const editForm = new FormValidator(options, popupElementEdit);
const addForm = new FormValidator(options, popupElementAdd);
editForm.enableValidation();
addForm.enableValidation();
//--

export { popupElementView, imageElement, captionElement };
