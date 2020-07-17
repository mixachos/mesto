class UserInfo {
  constructor({ nameElement, jobElement }) {
    this._nameElement = document.querySelector(nameElement);
    this._jobElement = document.querySelector(jobElement);
  }
  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent
    }
  }
  setUserInfo({ name, about }) {
    this._nameElement.textContent = name;
    this._jobElement.textContent = about;
  }
}

export { UserInfo };
