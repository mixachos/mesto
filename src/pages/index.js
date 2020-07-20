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
const editAvatarButton = profileElement.querySelector('.profile__edit-avatar-button');
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
      },
      handleLikeButtonClick: (evt) => {
        const likeButton = evt.target;
        likeButton.classList.toggle('cards__like-button_active');

        const isLiked = likeButton.classList.contains('cards__like-button_active');
        if (isLiked) {
          api.setLike(evt, item);
        } else {
          api.removeLike(evt, item);
        }
      },
      initCard: () => {
        api.initCard(card);
      }
    }
  );

  //card.init(); //??????

  const cardElement = card.generateCard();
  return cardElement;
}
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
      //userInfo.setUserInfo(dataSet); //установить на странице новые значения
      api.setUserInfo(dataSet);
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

      //cards.addItem(renderCard(item), 'CARD');  //добавить карточку в начало списка
      api.addNewCard(item);

      popupAdd.close();
    },
    clear: () => { addForm.clearInputError() }
  });

//--Попап с просмотром картинки
const popupView = new PopupWithImage('.popup_type_view', captionElement, imageElement);
//--

//--Попап удаления
const popupDelete = new Popup('.popup_type_delete-card'); //сделать отдельный класс ??????
//--

const popupEditAvatar = new Popup('.popup_type_edit-avatar');

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

editAvatarButton.addEventListener('click', () => {
  popupEditAvatar.open();
})
//--

//--Слушатели на попапы
popupEdit.setEventListeners();
popupAdd.setEventListeners();
popupView.setEventListeners();
popupDelete.setEventListeners();
popupEditAvatar.setEventListeners();
//--

//--Подключить валидацию форм
const editForm = new FormValidator(options, popupElementEdit);
const addForm = new FormValidator(options, popupElementAdd);
editForm.enableValidation();
addForm.enableValidation();
//--

export { popupElementView, imageElement, captionElement, popupDelete };


//SPRINT #9


class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    })
      .then((res) => { return res.json() })
      /*.then((result) => {

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
        //console.log(result);
      });*/
  }
  initCard(card) {
    fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(res => res.json())
      .then(result => {
        card.init(result);
      });
  }

  getUserInfo() {
    fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(res => res.json())
      .then((result) => {
        userInfo.setUserInfo(result);
        //console.log(result._id)
      });
  }
  setUserInfo({ name, about }) {
    fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
        .then(res => res.json())
        .then((result) => {
          userInfo.setUserInfo(result);
        });
  }
  addNewCard({ name, link, alt }) {
      fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
        alt: alt
      })
    })
      .then(res => res.json())
      .then((result) => {
        const cardsSection = document.querySelector('.cards__list');
        cardsSection.prepend(renderCard(result));

        console.log(cardsSection);
      });
  }
  setLike(evt, card) {
    fetch(`${this._baseUrl}/cards/likes/${card._id}`, {
      method: 'PUT',
      headers: this._headers,
    })
      .then(res => res.json())
      .then((result) => {
        const likesCounter = evt.target.nextElementSibling;
        const likesQty = result.likes.length;
        likesCounter.textContent = likesQty;
      });
  }
  removeLike(evt, card) {
    fetch(`${this._baseUrl}/cards/likes/${card._id}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(res => res.json())
      .then((result) => {
        const likesCounter = evt.target.nextElementSibling;
        const likesQty = result.likes.length;
        likesCounter.textContent = likesQty;
      });
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-13',
  headers: {
    authorization: '5eda30f0-ae1e-4616-84ef-341ffee20b13',
    'Content-Type': 'application/json'
  }
});

api.getInitialCards()
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
  //console.log(result);
});
api.getUserInfo();

