import { Popup } from './Popup.js';
import { captionElement, imageElement } from '../index.js';

class PopupWithImage extends Popup {
  open(item) {
    super.open();

    captionElement.textContent = item.name;
    imageElement.src = item.link;
    imageElement.alt = item.alt;
  }
}

export { PopupWithImage };
