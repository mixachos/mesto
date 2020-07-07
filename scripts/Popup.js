class Popup{
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this._handleEscClose = this._handleEscClose.bind(this);
    this._closeButton = this._popup.querySelector('.popup__close-button');
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
    //console.log(evt);
    if (evt.key === 'Escape') {
      this.close();
    }
  }
  setEventListeners(){
    this._closeButton.addEventListener('click', () => { this.close() });
    this._popup.addEventListener('click', (evt) => {
      const isPopupOverlayClicked = evt.target.classList.contains('popup'); //если щёлкнули по оверлею, закрыть попап
      if (isPopupOverlayClicked) {
        this.close();
      }
    });
  }
}

export { Popup };
