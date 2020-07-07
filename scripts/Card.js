import { popupElementView, imageElement, captionElement } from './index.js';

class Card {
  constructor(item, template, { handleCardClick }) {
    this._name = item.name;
    this._link = item.link;
    this._alt = item.alt;
    this._template = template;
    this.handleCardClick = handleCardClick;
  }

  generateCard() {  //собрать карточку по шаблону, добавить слушатели
    this._element = this._getTemplate();
    this._setEventListeners();

    const cardImage = this._element.querySelector('.cards__image');

    cardImage.src = this._link;
    cardImage.alt = this._alt;
    this._element.querySelector('.cards__caption-text').textContent = this._name;

    return this._element;
  }

  _getTemplate() {  //найти и скопировать разметку шаблона
    const cardElement = this._template.cloneNode(true);
    return cardElement;
  }

  _likeCard(likeButton) { //поставить лайк на карточку
    likeButton.classList.toggle('cards__like-button_active');
  }

  _deleteCard(deleteButton) { //удалить карточку
    deleteButton.closest('.cards__item').remove();
  }

  _setEventListeners() {  //добавить слушатели
    const likeButton = this._element.querySelector('.cards__like-button');
    const deleteButton = this._element.querySelector('.cards__delete-button');
    const cardImage = this._element.querySelector('.cards__image');

    likeButton.addEventListener('click', () => {  //на лайк
      this._likeCard(likeButton);
    });

    deleteButton.addEventListener('click', () => {  //на корзину
      this._deleteCard(deleteButton);
    });

    cardImage.addEventListener('click', () => {   //на картинку для открытия попапа view
      this.handleCardClick();
    });
  }
}

export { Card };
