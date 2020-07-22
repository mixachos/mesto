import { Card } from '../scripts/Card.js';
import { Section } from '../scripts/Section.js';
import { PopupWithImage } from '../scripts/PopupWithImage.js';
import { PopupWithForm } from '../scripts/PopupWithForm.js';
import { UserInfo } from '../scripts/UserInfo.js';
import { FormValidator } from '../scripts/FormValidator.js';
import { options } from '../scripts/data.js';
import { PopupWithConfirm } from '../scripts/PopupWithConfirm.js';
import { Api } from '../scripts/Api.js';
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

//--Элементы формы add
const titleInput = popupElementAdd.querySelector('.popup__input_type_title');
const linkInput = popupElementAdd.querySelector('.popup__input_type_link');
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
    jobElement: '.profile__job'
  }
);
//--

//--Собрать и вернуть карточку как экземпляр класса
function renderCard(item, userId) {
  const card = new Card(
    item,
    userId,
    cardTemplate,
    {
      handleCardClick: () => {  //при клике на картинке открывать попап просмотра и передавать туда данные
        popupView.open(item);
      },

      handleDeleteButtonClick: (evt) => { //при клике на корзине открыть попап подтверждения, передать данные карточки
        const cardButton = evt.target;
        popupDelete.open();
        popupDelete.pushData(item._id, cardButton);

      },
      handleLikeButtonClick: (evt) => {
        const likeButton = evt.target;   //на каком лайке кликнули
        likeButton.classList.toggle('cards__like-button_active');

        const isLiked = likeButton.classList.contains('cards__like-button_active'); //поставлен или снят лайк

        function countLike(result) {
          const likesCounter = evt.target.nextElementSibling;
          const likesQty = result.likes.length;
          likesCounter.textContent = likesQty;
        }

        if (isLiked) {
          api.setLike(item) //запрос на сервер для постановки лайка
            .then((result) => { //изменить количество лайков по данным с вервера
              countLike(result);
            });
        } else {
          api.removeLike(item)  //запрос для снятия лайка
            .then((result) => {
              countLike(result);
            });
        }
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
    handleFormSubmit: (itemId, cardButton) => {
      const confirmDeleteDefaultText = confirmDelete.textContent; //заменить текст на кнопке во время запроса на сервер
      confirmDelete.textContent = 'Удаление...'

      api.deleteCard(itemId) //удалить карточку с сервера
        .then(() => {
          cardButton.closest('.cards__item').remove();  //когда придёт ОК ответ, удалить карточку из разметки
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

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-13',
  headers: {
    authorization: '5eda30f0-ae1e-4616-84ef-341ffee20b13',
    'Content-Type': 'application/json'
  }
});

let userId;
api.getUserInfo() //забрать инфо с сервера
  .then((result) => {
    userInfo.setUserInfo(result);
    avatarImage.src = result.avatar;
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
