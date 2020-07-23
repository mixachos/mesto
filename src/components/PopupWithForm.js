import { Popup } from './Popup.js';

class PopupWithForm extends Popup {
  constructor(popupSelector, formSelector, inputSelector, { handleFormSubmit,  clear }) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._clear = clear;
    this._popup = document.querySelector(popupSelector);
    this._form = this._popup.querySelector(formSelector);
    this._inputList = this._form.querySelectorAll(inputSelector);
  }

  open() {
    super.open();
    this._clear();
  }

  close() {
    super.close();
    this._form.reset();
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (evt) => { this._handleFormSubmit(evt, this._getInputValues()) });
  }

  _getInputValues() {
    this._formValues = {};
    this._inputList.forEach(input => { this._formValues[input.id] = input.value });

    return this._formValues;
  }
}

export { PopupWithForm };
