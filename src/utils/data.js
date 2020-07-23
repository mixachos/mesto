//--Объект для настройки валидации
const objectOptionsForValidation = {
  formSelector: '.popup__container',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__save-button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
}
//--

//--Объект для работы с API
const apiConfig = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-13',
  headers: {
    authorization: '5eda30f0-ae1e-4616-84ef-341ffee20b13',
    'Content-Type': 'application/json'
  }
}
//--

export { apiConfig, objectOptionsForValidation as options };
