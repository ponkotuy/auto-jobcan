// ==UserScript==
// @name     auto-jobcan
// @include  https://ssl.jobcan.jp/employee/adit/modify*
// @version  1
// @grant    none
// ==/UserScript==

function main() {
  clockInHelper();
  dateHelper();
}

window.addEventListener('load', main);

function clockInHelper() {
  const time = document.getElementById('ter_time');
  const insertButton = document.getElementById('insert_button');
  const footer = document.querySelector('div.card-footer');
  addButton('自動出社', footer, () => {
    time.value = '1000';
    insertButton.click();
  });

  addButton('自動退社', footer, () => {
    time.value = '1900';
    insertButton.click();
  });
}

function dateHelper() {
  const dateForm = document.querySelector('form[name=form1]');
  const jobCanDate = new JobCanDate(dateForm);
  addDayOfWeek(dateForm, jobCanDate);

  addButton('前月初日', dateForm, () => {
    jobCanDate.month = jobCanDate.month - 1;
    jobCanDate.day = 1;
    dateForm.submit();
  });
  addButton('今日', dateForm, () => {
    jobCanDate.setNow();
    dateForm.submit();
  })
  addButton('次の日', dateForm, () => {
    jobCanDate.day = jobCanDate.day + 1;
    dateForm.submit();
  });
}

function addDayOfWeek(form, jobCanDate) {
  const text = document.createTextNode(`${jobCanDate.dayOfWeek}曜日`);
  const pElem = document.createElement("p");
  pElem.appendChild(text);
  form.appendChild(pElem);
}

function addButton(text, element, func) {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerText = text;
  button.onclick = func;
  element.appendChild(button);
}

class JobCanDate {
  constructor(form) {
    this.yearSelector = form.querySelector('select[name=year]');
    this.monthSelector = form.querySelector('select[name=month]');
    this.daySelector = form.querySelector('select[name=day]');
    this.date = new Date(this.year, this.month - 1, this.day);
  }

  get year() {
    return parseInt(this.yearSelector.selectedOptions[0].value);
  }

  get month() {
    return parseInt(this.monthSelector.selectedOptions[0].value);
  }

  set month(value) {
    this.date.setMonth(value - 1);
    this.refresh();
  }

  get day() {
    return parseInt(this.daySelector.selectedOptions[0].value);
  }

  set day(value) {
    this.date.setDate(value);
    this.refresh();
  }

  get dayOfWeek() {
    return [ "日", "月", "火", "水", "木", "金", "土" ][this.date.getDay()];
  }

  setNow() {
    this.date = new Date();
    this.refresh();
  }

  refresh() {
    this.yearSelector.querySelector(`option[value="${this.date.getFullYear()}"]`).selected = true;
    const newMonth = (this.date.getMonth() + 1).toString();
    this.monthSelector.querySelector(`option[value="${newMonth}"]`).selected = true;
    this.daySelector.querySelector(`option[value="${this.date.getDate()}"]`).selected = true;
  }
}
