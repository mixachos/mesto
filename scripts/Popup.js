class Popup{
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
  }
  open(){
    this._popup.classList.add('popup_opened');
    document.addEventListener('keydown', this._handleEscClose);

  }
  close(){
    this._popup.classList.remove('popup_opened');
    document.removeEventListener('keydown', this._handleEscClose);
  }
  _handleEscClose(evt){
    console.log(evt);
    if (evt.key === 'Escape') {
      document
      .querySelector('.popup_opened')
      .classList
      .remove('popup_opened');
    }
  }
  setEventListeners(closeButton){
    closeButton.addEventListener('click', () => { this.close() });
    this._popup.addEventListener('click', (evt) => {
      const isPopupOverlayClicked = evt.target.classList.contains('popup'); //если щёлкнули по оверлею, закрыть попап
      if (isPopupOverlayClicked) {
        this.close();
      }
    });
  }
}

export { Popup };
