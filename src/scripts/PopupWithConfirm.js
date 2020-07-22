import { Popup } from './Popup.js';

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

  setSubmitListener(itemId, cardButton) {
    this._form.addEventListener('submit', (evt) => {
      this._handleFormSubmit(evt, itemId, cardButton);
    });
  }

  setEventListeners() {
    super.setEventListeners();
  }
}

export { PopupWithConfirm };
