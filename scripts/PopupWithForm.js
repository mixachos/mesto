import { Popup } from './Popup.js';

class PopupWithForm extends Popup {
  constructor(popupSelector, { handleFormSubmit }) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._popup = document.querySelector(popupSelector);
    this._form = this._popup.querySelector('.popup__container');
    this._buttonElement = this._form.querySelector('.popup__save-button');
    this._inputList = this._form.querySelectorAll('.popup__input');
  }
  _hideInputError(inputElement) { //спрятать ошибку, сбросить подсветку поля
    const errorElement = this._form.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove('popup__input_type_error');
    errorElement.classList.remove('popup__input-error_active');
    errorElement.textContent = '';
  }
  open() {
    super.open();

    this._buttonElement.setAttribute('disabled', true);

    this._buttonElement.classList.add('popup__save-button_inactive');

    this._inputList.forEach((inputElement) => { this._hideInputError(inputElement) });

  }
  close(){
    super.close();
    this._form.reset();

  }
  _getInputValues() {
    //this._inputList = this._form.querySelectorAll('.popup__input');

    this._formValues = {};
    this._inputList.forEach(input => {this._formValues[input.id] = input.value});

    return this._formValues;
  }
  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (evt) => {this._handleFormSubmit(evt)});
  }


}

export { PopupWithForm };
