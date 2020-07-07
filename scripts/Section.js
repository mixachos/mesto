class Section {
  constructor({ items, renderer }, containerSelector) {
    this._itemsToRender = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }
  addItem(element, flag) {
    if (flag === 'CARD') {
      this._container.prepend(element);
    } else {
      this._container.append(element);
    }

  }
  renderItems() {
    this._itemsToRender.forEach(item => {
      this._renderer(item);
    });
  }
}

export { Section };
