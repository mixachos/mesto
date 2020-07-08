class UserInfo {
  constructor({ nameElement, jobElement }) {
    this._nameElement = document.querySelector(nameElement);
    this._jobElement = document.querySelector(jobElement);
  }
  getUserInfo() {
    this._pageValues = {};
    this._pageValues.nameInput = this._nameElement.textContent;
    this._pageValues.jobInput = this._jobElement.textContent;

    return this._pageValues;
  }
  setUserInfo({ name, job }) {
    this._nameElement.textContent = name;
    this._jobElement.textContent = job;
  }
}

export { UserInfo };
