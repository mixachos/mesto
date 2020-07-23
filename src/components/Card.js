class Card {
  constructor(card, userId, template, selectors, { handleCardClick, handleDeleteButtonClick, handleLikeButtonClick }) {

    this._name = card.name;
    this._link = card.link;
    this._alt = card.alt;
    this._likes = card.likes;
    this._ownerId = card.owner._id;
    this._cardId = card._id;
    this._userId = userId;
    this._template = template;
    this._selectors = selectors;
    this.handleCardClick = handleCardClick;
    this.handleDeleteButtonClick = handleDeleteButtonClick;
    this.handleLikeButtonClick = handleLikeButtonClick;
    this._element = this._getTemplate();
    this.likeButton = this._element.querySelector(this._selectors.likeButtonSelector);
    this.deleteButton = this._element.querySelector(this._selectors.deleteButtonSelector);
    this.cardImage = this._element.querySelector(this._selectors.imageSelector);
    this.likesCounter = this._element.querySelector(this._selectors.likeCounterSelector);
  }

  generateCard() {  //собрать карточку по шаблону, добавить слушатели
    this._setEventListeners();

    this._checkId();

    this.cardImage.src = this._link;
    this.cardImage.alt = this._alt;
    this._element.querySelector(this._selectors.imageCaptionSelector).textContent = this._name;
    this.likesCounter.textContent = this._getLikes();

    return this._element;
  }

  deleteCard() {

  }

  _checkId(){ //проверить владельца
    const isMyCard = this._ownerId === this._userId;
    if (!isMyCard) {
      this.deleteButton.remove(); //убрать кнопку "удалить" с чужих карточек
    }
    this._likes.forEach(item => {
      const isLiked = item._id === this._userId;
      if (isLiked) {
        this.likeButton.classList.toggle(this._selectors.likeButtonStatusSelector);  //закрасить лайк на отмеченных карточках
      }
    });
  }

  _getLikes() {
    return this._likes.length;
  }

  _getTemplate() {  //найти и скопировать разметку шаблона
    const cardElement = this._template.cloneNode(true);
    return cardElement;
  }

  _likeCard() { //поставить лайк на карточку
    this.likeButton.classList.toggle(this._selectors.likeButtonStatusSelector);
    this._isLiked = this.likeButton.classList.contains(this._selectors.likeButtonStatusSelector);
    this.handleLikeButtonClick(this._isLiked, this.likesCounter);
  }

  _setEventListeners() {  //добавить слушатели
    this.likeButton.addEventListener('click', () => {  //на лайк
      this._likeCard();
    });

    this.deleteButton.addEventListener('click', () => {  //на корзину
      this.handleDeleteButtonClick(this.deleteButton);
    });

    this.cardImage.addEventListener('click', () => {   //на картинку для открытия попапа view, действие определено при создании экземпляра
      this.handleCardClick();
    });
  }
}

export { Card };
