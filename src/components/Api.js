class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  _handleResponseError(err) {
    console.log(err)
    return Promise.reject(err.message);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  setUserAvatar({ link }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link
      })
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  addNewCard({ name, link, alt }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
        alt: alt
      })
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  setLike(card) {
    return fetch(`${this._baseUrl}/cards/likes/${card._id}`, {
      method: 'PUT',
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }

  removeLike(card) {
    return fetch(`${this._baseUrl}/cards/likes/${card._id}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._handleResponse)
      .catch(this._handleResponseError)
  }
}

export { Api };
