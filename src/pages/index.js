import { Card } from '../scripts/Card.js';
import { Section } from '../scripts/Section.js';
import { PopupWithImage } from '../scripts/PopupWithImage.js';
import { PopupWithForm } from '../scripts/PopupWithForm.js';
import { UserInfo } from '../scripts/UserInfo.js';
import { FormValidator } from '../scripts/FormValidator.js';
import { initialCards, options } from '../scripts/data.js';
import './index.css';
import { Popup } from '../scripts/Popup.js';
import { PopupWithConfirm } from '../scripts/PopupWithConfirm.js';

//--Находим блоки
const profileElement = document.querySelector('.profile');
const popupElementEdit = document.querySelector('.popup_type_edit');
const popupElementAdd = document.querySelector('.popup_type_add');
const popupElementView = document.querySelector('.popup_type_view');
const popupElementEditAvatar = document.querySelector('.popup_type_edit-avatar');
//--

//--Элементы на странице
const editButton = profileElement.querySelector('.profile__edit-button');
const addButton = profileElement.querySelector('.profile__add-button');
const editAvatarButton = profileElement.querySelector('.profile__edit-avatar-button');
const avatarImage = profileElement.querySelector('.profile__avatar');
//--

//--Элементы формы edit
const nameInput = popupElementEdit.querySelector('.popup__input_type_name');
const jobInput = popupElementEdit.querySelector('.popup__input_type_job');
//--

//--Элементы формы add
const titleInput = popupElementAdd.querySelector('.popup__input_type_title');
const linkInput = popupElementAdd.querySelector('.popup__input_type_link');
const saveCard = popupElementAdd.querySelector('.popup__save-button');
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
function renderCard(item, userId) {
  const card = new Card(
    item,
    userId,
    cardTemplate,
    {
      handleCardClick: () => {  //при клике на картинке открывать попап просмотра и передавать туда данные
        popupView.open(item);
      },
      handleDeleteButtonClick: (evt) => {
        const cardButton = evt.target;
        popupDelete.open();
        popupDelete.setSubmitListener(item._id, cardButton);
      },
      handleLikeButtonClick: (evt) => {
        const likeButton = evt.target;
        likeButton.classList.toggle('cards__like-button_active');

        const isLiked = likeButton.classList.contains('cards__like-button_active');


        if (isLiked) {
          api.setLike(item)
            .then((result) => {
              const likesCounter = evt.target.nextElementSibling;
              const likesQty = result.likes.length;
              likesCounter.textContent = likesQty;
            });
        } else {
          api.removeLike(item)
            .then((result) => {
              const likesCounter = evt.target.nextElementSibling;
              const likesQty = result.likes.length;
              likesCounter.textContent = likesQty;
            });
        }
      },
      /*initCard: () => {
        //api.initCard(card);
        console.log(userId);
      }*/
    }
  );
  //card.showId();

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
      api.setUserInfo(dataSet)
        .then((result) => {
          userInfo.setUserInfo(result);
        })
        .finally(() => {
          popupEdit.close();
        });
    },
    clear: () => { editForm.clearInputError() }
  },
);
//--

const popupEditAvatar = new PopupWithForm(
  '.popup_type_edit-avatar',
  '.popup__container',
  '.popup__input',
  {
    handleFormSubmit: (evt, formValues) => {  //при сабмите собрать данные с полей
      evt.preventDefault();

      const dataSet = {   //собрать объект на основе данных
        link: formValues['link-input']
      };

      api.setUserAvatar(dataSet)
        .then((result) => {
          avatarImage.src = result.avatar;
        })
        .finally(() => {
          popupEditAvatar.close();
        });
    },
    clear: () => { editAvatarForm.clearInputError() }
  },

);

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

      saveCard.textContent = 'Сохранение...';
      api.addNewCard(item)
        .then((result) => {
          const cardsSection = document.querySelector('.cards__list');
          cardsSection.prepend(renderCard(result, userId));
        })
        .finally(() => {
          popupAdd.close();
        })
    },
    clear: () => { addForm.clearInputError() }
  });

//--Попап с просмотром картинки
const popupView = new PopupWithImage('.popup_type_view', captionElement, imageElement);
//--

//--Попап удаления
const popupDelete = new PopupWithConfirm(
  '.popup_type_delete-card',
  '.popup__container',
  {
    handleFormSubmit: (evt, itemId, cardButton) => {
      evt.preventDefault();
      console.log(itemId);
      api.deleteCard(itemId)
        .then(() => {
          cardButton.closest('.cards__item').remove();
        })
        .finally(() => {
          popupDelete.close();
        })
    }
  }
);
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
const editAvatarForm = new FormValidator(options, popupElementEditAvatar);
editForm.enableValidation();
addForm.enableValidation();
editAvatarForm.enableValidation();
//--

export { popupElementView, imageElement, captionElement, popupDelete };


//SPRINT #9


class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  _handleResponseError(err) {
    console.log(err)
    return Promise.reject(err.message);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  //**********************
  /*initCard(card) {
    fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(res => res.json())
      .then(result => {
        card.init(result);
      });
  }*/
  //*************************

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  setUserAvatar({ link }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link
      })
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  addNewCard({ name, link, alt }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
        alt: alt
      })
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  setLike(card) {
    return fetch(`${this._baseUrl}/cards/likes/${card._id}`, {
      method: 'PUT',
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  removeLike(card) {
    return fetch(`${this._baseUrl}/cards/likes/${card._id}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-13',
  headers: {
    authorization: '5eda30f0-ae1e-4616-84ef-341ffee20b13',
    'Content-Type': 'application/json'
  }
});

let userId;
api.getUserInfo()
  .then((result) => {
    userInfo.setUserInfo(result);
    avatarImage.src = result.avatar;
    userId = result._id;
  })
  .finally(() => {

    api.getInitialCards()
      .then((result) => {

        result.forEach(item => {
          item.alt = `Фото "${item.name}" не загрузилось`;
        });
        const cards = new Section({
          items: result, //массив с данными
          renderer: (item) => { //собрать карточку и вставить разметку в список, определённый селектором
            cards.addItem(renderCard(item, userId));
          }
        }, '.cards__list');
        cards.renderItems();
      });
  })
