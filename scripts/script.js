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
    const cardItem = cardTemplate.cloneNode(true);

    addCardContent(item.link, item.name, item.alt, cardItem);
    cardsList.append(cardItem);  //добавили карточку в конец контейнера (списка)
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
function formSubmitHandler(evt) {
  evt.preventDefault();

  nameElement.textContent = nameInput.value;
  jobElement.textContent = jobInput.value;

  popupOpenClose(evt);
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

//--Управляем видимостью формы, при открытии - инициализация
function popupOpenClose(evt) {

  const popupType = evt.target.parentElement.parentElement; //определяем попап, в котором нажата кнопка
  const clickedButton = evt.target  //определяем, какая кнопка нажата

  //определяем, на форме какого попапа произошёл submit
  const isPopupEditSave = clickedButton.parentElement.classList.contains('popup_type_edit');
  const isPopupAddSave = clickedButton.parentElement.classList.contains('popup_type_add');

  //определяем попап для закрытия (второе условие в if)
  const isPopupEdit = popupType.classList.contains('popup_type_edit');
  const isPopupAdd = popupType.classList.contains('popup_type_add');
  const isPopupView = popupType.classList.contains('popup_type_view');

  //определяем открытость попапа (для инициализации). add не смотрим, т.к. в него не считываются данные со страницы
  const isPopupEditOpened = popupElementEdit.classList.contains('popup_opened');
  const isPopupViewOpened = popupElementView.classList.contains('popup_opened');

  //определяем состояние конкретной кнопки
  const isEditButton = clickedButton.classList.contains('profile__edit-button');
  const isAddButton = clickedButton.classList.contains('profile__add-button');
  const isImageButton = clickedButton.classList.contains('cards__image');

  //инициализация, открытие и закрытие формы edit
  if (isEditButton || isPopupEdit || isPopupEditSave) {
    if (!isPopupEditOpened) {
      initPopupEdit();
    }
    popupElementEdit.classList.toggle('popup_opened');

    popupElementEdit.parentElement.addEventListener('keydown', function () {escPressed(popupElementEdit)});

  }

  //открытие и закрытие формы add
  if (isAddButton || isPopupAdd || isPopupAddSave) {
    popupElementAdd.classList.toggle('popup_opened');

    popupElementAdd.parentElement.addEventListener('keydown', function () {escPressed(popupElementAdd)});

    titleInput.value = '';
    linkInput.value = '';
  }

  //инициализация, открытие и закрытие формы view
  if (isImageButton || isPopupView) {

    if (!isPopupViewOpened) {
      initPopupView(evt); //evt передаём, чтобы знать, на какой картинке щёлкнули
    }
    popupElementView.classList.toggle('popup_opened');

    popupElementView.parentElement.addEventListener('keydown', function () {escPressed(popupElementView)});
  }
}
//--

//--Добавить карточку на страницу из формы add
function addCard(evt) {
  evt.preventDefault();

  const cardItem = cardTemplate.cloneNode(true); //клонируем содержимое шаблона

  addCardContent(linkInput.value, titleInput.value, `Фото ${titleInput.value}`, cardItem); //передаём аргументами данные из формы и разметку из шаблона
  cardsList.prepend(cardItem);  //добавляем новую карточку в начало списка
  popupOpenClose(evt);
}
//--

//--Общая add, для формы добавления и инициализации страницы
function addCardContent(source, caption, alt, card) {

  card.querySelector('.cards__image').src = source; //картинке карточки присваиваем в атрибут src значение, переданное через source
  card.querySelector('.cards__caption-text').textContent = caption;   //заполняем содержимое надписи
  card.querySelector('.cards__image').alt = alt;

  //Навешиваем слушатели кнопкам лайк, удалить и открыть просмотр при щелчке по картинке
  card.querySelector('.cards__like-button').addEventListener('click', function (evt) {
    evt.target.classList.toggle('cards__like-button_active');
  });

  card.querySelector('.cards__delete-button').addEventListener('click', function (evt) {
    evt.target.parentElement.remove();
  });

  card.querySelector('.cards__image').addEventListener('click', popupOpenClose);
}
//--

initPage(); //Инициализация страницы, загрузка карточек из массива

//--Обрабатываем нажатия по кнопкам
editButton.addEventListener('click', popupOpenClose);
addButton.addEventListener('click', popupOpenClose);

closeButtonEdit.addEventListener('click', popupOpenClose);
closeButtonAdd.addEventListener('click', popupOpenClose);
closeButtonView.addEventListener('click', popupOpenClose);

popupElementAdd.addEventListener('submit', addCard); //обработка submit с формы предотвращает отправку пустой формы, поэтому клики на кнопках меняем на submit формы
popupElementEdit.addEventListener('submit', formSubmitHandler);
//--
