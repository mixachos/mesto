//--Данные для первичного заполнения страницы
const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
    alt: 'Фото Архыз'
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
    alt: 'Фото Челябинская область'
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
    alt: 'Фото Иваново'
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
    alt: 'Фото Камчатка'
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
    alt: 'Фото Холмогорский район'
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
    alt: 'Фото Байкал'
  }
];
//--

//--Находим блоки
const profileElement = document.querySelector('.profile');
const popupElementEdit = document.querySelector('.popup_type_edit');
const popupElementAdd = document.querySelector('.popup_type_add');
const popupElementView = document.querySelector('.popup_type_view');
//--

//--Элементы на странице
const editButton = profileElement.querySelector('.profile__edit-button');
const addButton = profileElement.querySelector('.profile__add-button');
const nameElement = profileElement.querySelector('.profile__name');
const jobElement = profileElement.querySelector('.profile__job');
//--

//--Элементы формы edit
const closeButtonEdit = popupElementEdit.querySelector('.popup__close-button');
const saveButtonEdit = popupElementEdit.querySelector('.popup__save-button');
const nameInput = popupElementEdit.querySelector('.popup__input_type_name');
const jobInput = popupElementEdit.querySelector('.popup__input_type_job');
//--

//--Элементы формы add
const closeButtonAdd = popupElementAdd.querySelector('.popup__close-button');
const saveButtonAdd = popupElementAdd.querySelector('.popup__save-button');
const titleInput = popupElementAdd.querySelector('.popup__input_type_title');
const linkInput = popupElementAdd.querySelector('.popup__input_type_link');
//--

//--Элементы формы view
const closeButtonView = popupElementView.querySelector('.popup__close-button');
const captionElement = popupElementView.querySelector('.popup__image-caption');
//--

//--Шаблон карточки
const cardsList = document.querySelector('.cards__list');  //выбрали контейнер для добавления в него карточек
const cardTemplate = document.querySelector('#card-template').content;  //содержимое шаблона
//--

//--Инициализация страницы. Заполнить карточки по шаблону, беря данные из массива
function initPage() {
  initialCards.forEach(item => {
    renderCard(item, 'ARRAY');
  });
}
//--

//--Инициализация формы edit, считываем значения со страницы
function initPopupEdit() {
  nameInput.value = nameElement.textContent;
  jobInput.value = jobElement.textContent;
}
//--

//--Инициализация формы view просмотра картинки
function initPopupView(evt) {
  const imageElement = popupElementView.querySelector('.popup__image');
  const captionElement = popupElementView.querySelector('.popup__image-caption');

  imageElement.src = evt.target.getAttribute('src');

  captionElement.textContent = evt.target.parentElement.querySelector('.cards__caption-text').textContent;
}
//--

//--Записываем значения из формы edit на страницу
function editProfile(evt) {
  evt.preventDefault();

  nameElement.textContent = nameInput.value;
  jobElement.textContent = jobInput.value;

  popupOpenClose(popupElementEdit);
}
//--

//--Обработка нажатия esc, закрытие попапа
function escPressed(popup) {
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      popup.classList.remove('popup_opened');
    }
  });
}
//--

//--Управляем видимостью формы
function popupOpenClose(popup) {
  //ФОРМАТИРОВАТЬ КОД
  if (!popup.classList.contains('popup_opened')) {
  Array.from(popup.querySelectorAll('.popup__input')).forEach((inputElement) => {inputElement.classList.remove('popup__input_type_error');});
  Array.from(popup.querySelectorAll('.popup__input-error')).forEach((errorElement) => {
    errorElement.textContent = '';
    errorElement.classList.remove('popup__input-error_active');});
  }
  //

  popup.classList.toggle('popup_opened');
  popup.closest('.root').addEventListener('keydown', escPressed(popup));




}
//--

//--Добавляем карточку на страницу
function renderCard(item, flag) {
  const cardItem = cardTemplate.cloneNode(true);
  cardItem.querySelector('.cards__image').src = item.link;
  cardItem.querySelector('.cards__caption-text').textContent = item.name;
  cardItem.querySelector('.cards__image').alt = item.alt;

  //навешиваем слушатели на кнопки
  cardItem.querySelector('.cards__like-button').addEventListener('click', function (evt) {
    evt.target.classList.toggle('cards__like-button_active');
  });

  cardItem.querySelector('.cards__delete-button').addEventListener('click', function (evt) {
    evt.target.closest('.cards__item').remove();
  });

  cardItem.querySelector('.cards__image').addEventListener('click', (evt) => {
    initPopupView(evt);
    popupOpenClose(popupElementView);
  });

  //проверяем откуда вызвана функция, вставляем карточку в начало или в конец списка
  if (flag === 'ARRAY') {
    cardsList.append(cardItem);
  }
  if (flag === 'FORM') {
    cardsList.prepend(cardItem);
  }
}
//--

//--Добавить карточку на страницу из формы add
function addCard(evt) {
  evt.preventDefault();

  const item = {
    name: `${titleInput.value}`,
    link: `${linkInput.value}`,
    alt: `Фото ${titleInput.value}`
  };

  renderCard(item, 'FORM');
  popupOpenClose(popupElementAdd);
}
//--

initPage(); //Инициализация страницы, загрузка карточек из массива

//--Обрабатываем нажатия по кнопкам
editButton.addEventListener('click', () => {
  initPopupEdit();
  popupOpenClose(popupElementEdit);
});
addButton.addEventListener('click', () => {
  titleInput.value = '';
  linkInput.value = '';

  popupOpenClose(popupElementAdd);
});

closeButtonEdit.addEventListener('click', () => { popupOpenClose(popupElementEdit); });
closeButtonAdd.addEventListener('click', () => { popupOpenClose(popupElementAdd) });
closeButtonView.addEventListener('click', () => { popupOpenClose(popupElementView) });

popupElementAdd.addEventListener('submit', addCard); //обработка submit с формы предотвращает отправку пустой формы, поэтому клики на кнопках меняем на submit формы
popupElementEdit.addEventListener('submit', editProfile);
//--

//СПРИНТ №6

const objectOptionsForValidation = {
  formSelector: '.popup__container',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}


function isValid(formElement, inputElement) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

function showInputError(formElement, inputElement, errorMessage) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  //console.log(errorElement);
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__input-error_active');
};

function hideInputError(formElement, inputElement) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove('popup__input_type_error');
  errorElement.classList.remove('popup__input-error_active');
  errorElement.textContent = '';
};

function setEventListeners(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__save-button');
  toggleButtonState(inputList, buttonElement);
  //console.log(inputList);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

function enableValidation(options) {
  const formList = Array.from(document.querySelectorAll('.popup__container'));
  //console.log(formList);
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement);
  });
};

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
};

function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.setAttribute('disabled', true);
    buttonElement.classList.add('popup__save-button_inactive');
  } else {
    buttonElement.removeAttribute('disabled');
    buttonElement.classList.remove('popup__save-button_inactive');
  }
};

enableValidation(objectOptionsForValidation);

function setPopupEventListeners() {
  const popupList = Array.from(document.querySelectorAll('.popup'));
  popupList.forEach((popupElement) => {
    popupElement.addEventListener('click', (evt) => {
      const isPopupOverlayClicked = evt.target.classList.contains('popup');
      if (isPopupOverlayClicked) {
        popupOpenClose(popupElement);
      }
    });
  });
}

setPopupEventListeners();
