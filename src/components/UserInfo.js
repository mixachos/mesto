class UserInfo {
  constructor({ nameElement, jobElement, avatarElement }) {
    this._nameElement = document.querySelector(nameElement);
    this._jobElement = document.querySelector(jobElement);
    this._avatarElement = document.querySelector(avatarElement);
  }
  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
    }
  }
  setUserInfo({ name, about, avatar }) {
    this._nameElement.textContent = name;
    this._jobElement.textContent = about;
    this._avatarElement.src = avatar;
  }
}

export { UserInfo };
