import {popupDelete} from '../pages/index.js';

class Card {
  constructor({ name, link, alt, likes }, template, { handleCardClick, handleDeleteButtonClick }) {
    this._name = name;
    this._link = link;
    this._alt = alt;
    this._likes = likes;
    this._template = template;
    this.handleCardClick = handleCardClick;
    this.handleDeleteButtonClick = handleDeleteButtonClick;
  }

  generateCard() {  //собрать карточку по шаблону, добавить слушатели
    this._element = this._getTemplate();

    //this._setEventListeners();

    const cardImage = this._element.querySelector('.cards__image');

    const deleteButton = this._element.querySelector('.cards__delete-button');
    deleteButton.remove();

    cardImage.src = this._link;
    cardImage.alt = this._alt;
    this._element.querySelector('.cards__caption-text').textContent = this._name;
    this._element.querySelector('.cards__caption-text').textContent = this._getLikes();

    return this._element;
  }

  _getLikes() {
    return this._likes.length;
  }

  _getTemplate() {  //найти и скопировать разметку шаблона
    const cardElement = this._template.cloneNode(true);
    return cardElement;
  }

  _likeCard(likeButton) { //поставить лайк на карточку
    likeButton.classList.toggle('cards__like-button_active');
  }

  _deleteCard(deleteButton) { //удалить карточку
    //popupDelete.open(); //вынести обработчик наружу
    //deleteButton.closest('.cards__item').remove();
  }

  _setEventListeners() {  //добавить слушатели
    const likeButton = this._element.querySelector('.cards__like-button');
    const deleteButton = this._element.querySelector('.cards__delete-button');
    const cardImage = this._element.querySelector('.cards__image');

    likeButton.addEventListener('click', () => {  //на лайк
      this._likeCard(likeButton);
    });

    deleteButton.addEventListener('click', (evt) => {  //на корзину
      //this._deleteCard(deleteButton);
      this.handleDeleteButtonClick(evt);
    });

    cardImage.addEventListener('click', () => {   //на картинку для открытия попапа view, действие определено при создании экземпляра
      this.handleCardClick();
    });
  }
}

export { Card };
