import {popupDelete} from '../pages/index.js';

class Card {
  constructor(card, userId, template, { handleCardClick, handleDeleteButtonClick, handleLikeButtonClick }) {

    this._name = card.name;
    this._link = card.link;
    this._alt = card.alt;
    this._likes = card.likes;
    this._ownerId = card.owner._id;
    this._cardId = card._id;
    this._userId = userId;
    this._template = template;
    this.handleCardClick = handleCardClick;
    this.handleDeleteButtonClick = handleDeleteButtonClick;
    this.handleLikeButtonClick = handleLikeButtonClick;
    //this.initCard = initCard;
    this._element = this._getTemplate();
    this.likeButton = this._element.querySelector('.cards__like-button');
    this.deleteButton = this._element.querySelector('.cards__delete-button');
    this.likeButton = this._element.querySelector('.cards__like-button');
    this.cardImage = this._element.querySelector('.cards__image');
  }

  generateCard() {  //собрать карточку по шаблону, добавить слушатели
    this._setEventListeners();

    this.showId();

    this.cardImage.src = this._link;
    this.cardImage.alt = this._alt;
    this._element.querySelector('.cards__caption-text').textContent = this._name;
    this._element.querySelector('.cards__like-counter').textContent = this._getLikes();

    return this._element;
  }

  showId(){
    const isMyCard = this._ownerId === this._userId;
    if (!isMyCard) {
      this.deleteButton.remove();
    }
    this._likes.forEach(item => {
      const isLiked = item._id === this._userId;
      if (isLiked) {
        this.likeButton.classList.toggle('cards__like-button_active');
      }
    });
  }

  /*init(options) {
    const isMyCard = this._ownerId === options._id;
    if (!isMyCard) {
      this.deleteButton.remove();
    }
    this._likes.forEach(item => {
      const isLiked = item._id === options._id;
      if (isLiked) {
        this.likeButton.classList.toggle('cards__like-button_active');
      }
    });
  }*/

  _getLikes() {
    return this._likes.length;
  }

  _getTemplate() {  //найти и скопировать разметку шаблона
    const cardElement = this._template.cloneNode(true);
    return cardElement;
  }

  _likeCard(evt) { //поставить лайк на карточку
    this.handleLikeButtonClick(evt);
  }

  _deleteCard(deleteButton) { //удалить карточку
    //popupDelete.open(); //вынести обработчик наружу
    //deleteButton.closest('.cards__item').remove();
  }

  _setEventListeners() {  //добавить слушатели
    this.likeButton.addEventListener('click', (evt) => {  //на лайк
      this._likeCard(evt);
    });

    this.deleteButton.addEventListener('click', (evt) => {  //на корзину
      this.handleDeleteButtonClick(evt);
    });

    this.cardImage.addEventListener('click', () => {   //на картинку для открытия попапа view, действие определено при создании экземпляра
      this.handleCardClick();
    });
  }
}

export { Card };
