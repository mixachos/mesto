import { Popup } from './Popup.js';

class PopupWithImage extends Popup {
  constructor(popupSelector, captionElement, imageElement) {
    super(popupSelector);
    this._captionElement = captionElement;
    this._imageElement = imageElement;
  }
  open({ name, link, alt }) {
    super.open();

    this._captionElement.textContent = name;
    this._imageElement.src = link;
    this._imageElement.alt = alt;
  }
}

export { PopupWithImage };
