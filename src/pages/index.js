import { Card } from '../components/Card.js';
import { Section } from '../components/Section.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import { PopupWithForm } from '../components/PopupWithForm.js';
import { UserInfo } from '../components/UserInfo.js';
import { FormValidator } from '../components/FormValidator.js';
import { options } from '../utils/data.js';
import { apiConfig } from '../utils/data.js';
import { PopupWithConfirm } from '../components/PopupWithConfirm.js';
import { Api } from '../components/Api.js';
import './index.css';

//--Находим блоки
const profileElement = document.querySelector('.profile');
const popupElementEdit = document.querySelector('.popup_type_edit');
const popupElementAdd = document.querySelector('.popup_type_add');
const popupElementView = document.querySelector('.popup_type_view');
const popupElementEditAvatar = document.querySelector('.popup_type_edit-avatar');
const popupElementDeleteCard = document.querySelector('.popup_type_delete-card');
//--

//--Элементы на странице
const editButton = profileElement.querySelector('.profile__edit-button');
const addButton = profileElement.querySelector('.profile__add-button');
const editAvatarButton = profileElement.querySelector('.profile__edit-avatar-button');
const avatarImage = profileElement.querySelector('.profile__avatar');
//--

//--Элементы формы edit
const nameInput = popupElementEdit.querySelector('.popup__input_type_name');
const jobInput = popupElementEdit.querySelector('.popup__input_type_job');
//--

//--Кнопки submit всех форм
const saveCard = popupElementAdd.querySelector('.popup__save-button');
const saveAvatar = popupElementEditAvatar.querySelector('.popup__save-button');
const saveInfo = popupElementEdit.querySelector('.popup__save-button');
const confirmDelete = popupElementDeleteCard.querySelector('.popup__save-button');
//--

//--Элементы формы view
const imageElement = popupElementView.querySelector('.popup__image');
const captionElement = popupElementView.querySelector('.popup__image-caption');
//--

//--Шаблон карточки
const cardTemplate = document.querySelector('#card-template').content;  //содержимое шаблона
//--

//--Для сбора и записи данных через форму редактирования
const userInfo = new UserInfo(
  {
    nameElement: '.profile__name',
    jobElement: '.profile__job',
    avatarElement: '.profile__avatar'
  }
);
//--

//--Собрать и вернуть карточку как экземпляр класса
function renderCard(item, userId) {

  const selectors = {
    likeButtonSelector: '.cards__like-button',
    likeCounterSelector: '.cards__like-counter',
    deleteButtonSelector: '.cards__delete-button',
    imageSelector: '.cards__image',
    imageCaptionSelector: '.cards__caption-text',
    likeButtonStatusSelector: 'cards__like-button_active'
  }

  const card = new Card(
    item,
    userId,
    cardTemplate,
    selectors,
    {
      handleCardClick: () => {  //при клике на картинке открывать попап просмотра и передавать туда данные
        popupView.open(item);
      },

      handleDeleteButtonClick: (deleteButton) => { //при клике на корзине открыть попап подтверждения, передать данные карточки
        popupDelete.open();
        popupDelete.pushData(item, deleteButton);
      },

      handleLikeButtonClick: (isLiked, likesCounter) => {

        function countLike(result) {
          likesCounter.textContent = result.likes.length;
        }

        isLiked
          ? api.setLike(item).then((result) => { countLike(result) })
          : api.removeLike(item).then((result) => { countLike(result) });

      },
    }
  );

  const cardElement = card.generateCard();
  return cardElement;
}
//--

//--Попап с формой редактирования профиля
const popupEdit = new PopupWithForm(
  '.popup_type_edit',
  '.popup__container',
  '.popup__input',
  {
    handleFormSubmit: (evt, formValues) => {  //при сабмите собрать данные с полей
      evt.preventDefault();

      const dataSet = {   //собрать объект на основе данных
        name: formValues['name-input'],
        about: formValues['job-input']
      };

      const saveInfoDefaultText = saveInfo.textContent;
      saveInfo.textContent = 'Сохранение...';


      api.setUserInfo(dataSet)  //отправить новые данные на сервер
        .then((result) => {
          userInfo.setUserInfo(result); //установить данные на странице
        })
        .finally(() => {
          popupEdit.close();
          saveInfo.textContent = saveInfoDefaultText;
        });
    },
    clear: () => { editForm.clearInputError() }
  },
);
//--

//--Попап с формой смены аватара
const popupEditAvatar = new PopupWithForm(
  '.popup_type_edit-avatar',
  '.popup__container',
  '.popup__input',
  {
    handleFormSubmit: (evt, formValues) => {  //при сабмите собрать данные с полей
      evt.preventDefault();

      const dataSet = {   //собрать объект на основе данных
        link: formValues['link-input']
      };

      const saveAvatarDefaultText = saveAvatar.textContent;
      saveAvatar.textContent = 'Сохранение...';

      api.setUserAvatar(dataSet)  //отправить ссылку на аватар на сервер
        .then((result) => {
          avatarImage.src = result.avatar;  //обновить аватар на станице
        })
        .finally(() => {
          popupEditAvatar.close();
          saveAvatar.textContent = saveAvatarDefaultText;
        });
    },
    clear: () => { editAvatarForm.clearInputError() }
  },
);
//--

//--Попап с формой добавления карточки
const popupAdd = new PopupWithForm(
  '.popup_type_add',  //селектор попапа
  '.popup__container', //для выбора формы при навешивании слушателя
  '.popup__input',  //для выбора инпутов формы, для сбора значений, очистки
  {
    handleFormSubmit: (evt, formValues) => {  //при сабмите собрать данные с полей
      evt.preventDefault();

      const item = {  //собрать объект на основе данных
        name: formValues['place-input'],
        link: formValues['link-input'],
        alt: `Фото ${formValues['place-input']}`
      };

      const saveCardDefaultText = saveCard.textContent;
      saveCard.textContent = 'Сохранение...';

      api.addNewCard(item)  //добавить карточку на сервер
        .then((result) => {
          const cardsSection = document.querySelector('.cards__list');
          cardsSection.prepend(renderCard(result, userId)); //добавить карточку в разметку
        })
        .finally(() => {
          popupAdd.close();
          saveCard.textContent = saveCardDefaultText;
        })
    },
    clear: () => { addForm.clearInputError() }
  });

//--Попап с просмотром картинки
const popupView = new PopupWithImage('.popup_type_view', captionElement, imageElement);
//--

//--Попап удаления
const popupDelete = new PopupWithConfirm(
  '.popup_type_delete-card',
  '.popup__container',
  {
    handleFormSubmit: (itemId, deleteButton) => {
      const confirmDeleteDefaultText = confirmDelete.textContent; //заменить текст на кнопке во время запроса на сервер
      confirmDelete.textContent = 'Удаление...'

      api.deleteCard(itemId) //удалить карточку с сервера
        .then(() => {
          deleteButton.closest('.cards__item').remove();  //когда придёт ОК ответ, удалить карточку из разметки
        })
        .finally(() => {
          popupDelete.close();
          confirmDelete.textContent = confirmDeleteDefaultText; //вернуть исходный текст
        })
    }
  }
);
//--

//--Слушатели на кнопки, для открытия попапов
editButton.addEventListener('click', () => {
  const pageValues = userInfo.getUserInfo();  //взять данные со страницы

  nameInput.value = pageValues.name; //установить новые значения полям формы
  jobInput.value = pageValues.job;

  popupEdit.open();
});

addButton.addEventListener('click', () => {
  popupAdd.open();
});

editAvatarButton.addEventListener('click', () => {
  popupEditAvatar.open();
});
//--

//--Слушатели на попапы
popupEdit.setEventListeners();
popupAdd.setEventListeners();
popupView.setEventListeners();
popupDelete.setEventListeners();
popupEditAvatar.setEventListeners();
//--

//--Подключить валидацию форм
const editForm = new FormValidator(options, popupElementEdit);
const addForm = new FormValidator(options, popupElementAdd);
const editAvatarForm = new FormValidator(options, popupElementEditAvatar);
editForm.enableValidation();
addForm.enableValidation();
editAvatarForm.enableValidation();
//--

const api = new Api(apiConfig);

let userId;
api.getUserInfo() //забрать инфо с сервера
  .then((result) => {
    userInfo.setUserInfo(result);
    userId = result._id;
  })
  .finally(() => { //ждать всё, чтобы отдать userId в карточки для проверки владельца

    api.getInitialCards()
      .then((result) => {

        result.forEach(item => { //карточки на сервере без alt, поставить alt каждой
          item.alt = `Фото "${item.name}" не загрузилось`;
        });
        const cards = new Section({
          items: result, //массив с данными
          renderer: (item) => { //собрать карточку и вставить разметку в список, определённый селектором
            cards.addItem(renderCard(item, userId));
          }
        }, '.cards__list');
        cards.renderItems();
      });
  });

export { popupElementView, imageElement, captionElement, popupDelete };
