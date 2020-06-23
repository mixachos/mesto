class FormValidator {
  constructor(options, formSelector) {
    this._formSelector = formSelector;
    this._inputSelector = options.inputSelector;
    this._submitButtonSelector = options.submitButtonSelector;
    this._inactiveButtonClass = options.inactiveButtonClass;
    this._inputErrorClass = options.inputErrorClass;
    this._errorClass = options.errorClass;
    this._buttonElement = this._formSelector.querySelector(this._submitButtonSelector);
    this._inputList = Array.from(this._formSelector.querySelectorAll(this._inputSelector));
  }

  enableValidation() {
    this._formSelector.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    this._setEventListeners();
  }

  clearInputError() { //Очистка ошибок, если при предыдущем открытии попапа были введены некорректные данные
    this._disableSaveButton();
    this._inputList.forEach((inputElement) => { this._hideInputError(inputElement) });
  }

  _hasInvalidInput() { //есть ли хотя бы одно невалидное поле
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  _toggleButtonState() { //состояние кнопки в зависимости от корректности ввода
    if (this._hasInvalidInput()) {
      this._disableSaveButton();
    } else {
      this._buttonElement.removeAttribute('disabled');
      this._buttonElement.classList.remove(this._inactiveButtonClass);
    }
  }

  _setEventListeners() {  //слушатели на поля ввода
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._isValid(inputElement);
        this._toggleButtonState();
      });
    });
  }

  _isValid(inputElement) {  //показываем/прячем сообщения об ошибках ввода в зависимости от корректности
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _showInputError(inputElement, errorMessage) { //показать ошибку, подсветить поле ввода
    const errorElement = this._formSelector.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(this._inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(this._errorClass);
  }

  _hideInputError(inputElement) { //спрятать ошибку, сбросить подсветку поля
    const errorElement = this._formSelector.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(this._inputErrorClass);
    errorElement.classList.remove(this._errorClass);
    errorElement.textContent = '';
  }

  _disableSaveButton() { //заблокировать кнопку
    this._buttonElement.setAttribute('disabled', true);
    this._buttonElement.classList.add(this._inactiveButtonClass);
  }
}

export { FormValidator };
