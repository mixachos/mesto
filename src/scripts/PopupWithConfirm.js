import { Popup } from './Popup.js';
import { data } from 'autoprefixer';

class PopupWithConfirm extends Popup {
  constructor(popupSelector, formSelector, { handleFormSubmit }) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._popup = document.querySelector(popupSelector);
    this._form = this._popup.querySelector(formSelector);
  }

  open() {
    super.open();
  }

  close() {
    super.close();
  }

  pushData(itemId, cardButton) {
    this._id = itemId;
    this._button = cardButton;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      this._handleFormSubmit(this._id, this._button);
    });
  }
}

export { PopupWithConfirm };
