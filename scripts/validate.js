//--Объект для настройки
const objectOptionsForValidation = {
  formSelector: '.popup__container',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__save-button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
}
//--

//--Проверка валидности поля ввода
function isValid(formElement, inputElement, options) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, options);
  } else {
    hideInputError(formElement, inputElement, options);
  }
}
//--

//--Показываем стандартное сообщение об ошибке ввода и подсвечиваем само поле
function showInputError(formElement, inputElement, errorMessage, options) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(options.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(options.errorClass);
}
//--

//--Прячем ошибку
function hideInputError(formElement, inputElement, options) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(options.inputErrorClass);
  errorElement.classList.remove(options.errorClass);
  errorElement.textContent = '';
}
//--

//--Навешиваем слушатель на каждое поле ввода
function setEventListeners(formElement, options) {
  const inputList = Array.from(formElement.querySelectorAll(options.inputSelector));
  const buttonElement = formElement.querySelector(options.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, options);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, options);
      toggleButtonState(inputList, buttonElement, options);
    });
  });
}
//--

//--Инициализация валидации
function enableValidation(options) {
  const formList = Array.from(document.querySelectorAll(options.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, options);
  });
}
//--

//--Проверяем есть ли в форме хотя бы одно невалидное поле
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}
//--

//--Переключаем состояние кнопки в зависимости от валидности полей
function toggleButtonState(inputList, buttonElement, options) {
  if (hasInvalidInput(inputList)) {
    disableSaveButton(buttonElement, options);
  } else {
    buttonElement.removeAttribute('disabled');
    buttonElement.classList.remove(options.inactiveButtonClass);
  }
}
//--

//--Делаем кнопку "save" неактивной
function disableSaveButton(buttonElement, options) {
  buttonElement.setAttribute('disabled', true);
  buttonElement.classList.add(options.inactiveButtonClass);
}
//--

//--Очистка ошибок, если при предыдущем открытии попапа были введены некорректные данные
function clearInputError(popup, isPopupOpened) {

  //при открытии кнопка "save" неактивна, т.к. нет никаких изменений и нечего сохранять. Исключён из обработки попап с просмотром картинки
  const isPopupView = popup.classList.contains('popup_type_view');
  if (!isPopupView) {
    const buttonElement = popup.querySelector(objectOptionsForValidation.submitButtonSelector);
    disableSaveButton(buttonElement, objectOptionsForValidation);
  }
  //

  if (!isPopupOpened) {
    const inputList = Array.from(popup.querySelectorAll(objectOptionsForValidation.inputSelector));
    inputList.forEach((inputElement) => {
      hideInputError(popup, inputElement, objectOptionsForValidation);
    });
  }
}
//--
