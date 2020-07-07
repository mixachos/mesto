class UserInfo {
  constructor(nameElement, jobElement) {
    this._nameValue = document.querySelector(nameElement).textContent;
    this._jobValue = document.querySelector(jobElement).textContent;

  }
  getUserInfo() {
    this._pageValues = {};
    this._pageValues.nameInput = this._nameValue;
    this._pageValues.jobInput = this._jobValue;

    return this._pageValues;
  }
  setUserInfo({ name, job }, { nameElement, jobElement }) {
    nameElement.textContent = name;
    jobElement.textContent = job;
  }
}

export { UserInfo };
