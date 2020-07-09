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
  setUserInfo(formValues) {
    this._nameElement.textContent = formValues['name-input'];
    this._jobElement.textContent = formValues['job-input'];
  }
}

export { UserInfo };
