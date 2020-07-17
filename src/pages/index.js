import { Card } from '../scripts/Card.js';
import { Section } from '../scripts/Section.js';
import { PopupWithImage } from '../scripts/PopupWithImage.js';
import { PopupWithForm } from '../scripts/PopupWithForm.js';
import { UserInfo } from '../scripts/UserInfo.js';
import { FormValidator } from '../scripts/FormValidator.js';
import { initialCards, options } from '../scripts/data.js';
import './index.css';
import { Popup } from '../scripts/Popup.js';

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
      },
      handleDeleteButtonClick: (evt) => {
        popupDelete.open();

        evt.target.closest('.cards__item').remove();
      }
    }
    );
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
  '.popup__container',
  '.popup__input',
  {
    handleFormSubmit: (evt, formValues) => {  //при сабмите собрать данные с полей
      evt.preventDefault();

      const dataSet = {   //собрать объект на основе данных
        name: formValues['name-input'],
        about: formValues['job-input']
      };

      userInfo.setUserInfo(dataSet); //установить на странице новые значения
      popupEdit.close();
    },
    clear: () => { editForm.clearInputError() }
  },

);
//--

//--Попап с формой добавления карточки
const popupAdd = new PopupWithForm(
  '.popup_type_add',  //селектор попапа
  '.popup__container', //для выбора формы при навешивании слушателя
  '.popup__input',  //для выбора инпутов формы, для сбора значений, очистки
  {
    handleFormSubmit: (evt, formValues) => {  //при сабмите собрать данные с полей
      evt.preventDefault();

      const item = {  //собрать объект на основе данных
        name: formValues['place-input'],
        link: formValues['link-input'],
        alt: `Фото ${formValues['place-input']}`
      };

      cards.addItem(renderCard(item), 'CARD');  //добавить карточку в начало списка
      popupAdd.close();
    },
    clear: () => { addForm.clearInputError() }
  });

//--Попап с просмотром картинки
const popupView = new PopupWithImage('.popup_type_view', captionElement, imageElement);
//--

//--Попап удаления
const popupDelete = new Popup('.popup_type_delete-card'); //сделать отдельный класс
//--

//--Слушатели на кнопки, для открытия попапов
editButton.addEventListener('click', () => {
  const pageValues = userInfo.getUserInfo();  //взять данные со страницы

  nameInput.value = pageValues.name; //установить новые значения полям формы
  jobInput.value = pageValues.job;

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
popupDelete.setEventListeners();
//--

//--Подключить валидацию форм
const editForm = new FormValidator(options, popupElementEdit);
const addForm = new FormValidator(options, popupElementAdd);
editForm.enableValidation();
addForm.enableValidation();
//--

export { popupElementView, imageElement, captionElement, popupDelete };


//SPRINT #9
fetch('https://mesto.nomoreparties.co/v1/cohort-13/cards', {
  headers: {
    authorization: '5eda30f0-ae1e-4616-84ef-341ffee20b13'
  }
})
  .then(res => res.json())
  .then((result) => {
    result.forEach(item => {
      item.alt = `Фото "${item.name}" не загрузилось`;
    });
    const cards = new Section({
      items: result, //массив с данными
      renderer: (item) => { //собрать карточку и вставить разметку в список, определённый селектором
        cards.addItem(renderCard(item));
      }
    }, '.cards__list');
    cards.renderItems();
    console.log(result);
  });
fetch('https://mesto.nomoreparties.co/v1/cohort-13/users/me', {
  headers: {
    authorization: '5eda30f0-ae1e-4616-84ef-341ffee20b13'
  }
})
  .then(res => res.json())
  .then((result) => {
    userInfo.setUserInfo(result);
    console.log(result);
  console.log(userInfo.getUserInfo().name);
  });


 /*fetch('https://mesto.nomoreparties.co/v1/cohort-13/users/me', {
  method: 'PATCH',
  headers: {
    authorization: '5eda30f0-ae1e-4616-84ef-341ffee20b13',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Васька',
    about: 'Physicist and Chemist'
  })
});*/
const obj = JSON.stringify({
  name: `${userInfo.getUserInfo().name}-test`,
  about: 'Physicist and Chemist'
})
console.log(typeof(obj));

