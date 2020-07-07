import { Popup } from './Popup.js';
import { captionElement, imageElement } from './index.js';

class PopupWithImage extends Popup {
  /*constructor(popupSelector) {
    super(popupSelector);
  }*/
  open(item) {
    super.open();

    /*const popupView = document.querySelector('.popup_type_view');
    popupView.classList.add('popup_opened');*/

    captionElement.textContent = item.name;
    imageElement.src = item.link;
    imageElement.alt = item.alt;
  }
}

export { PopupWithImage };
