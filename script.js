"use strict";

const calendar = document.querySelector(".container");
const btns = calendar.querySelector(".months-container");
const monthsList = btns.querySelector(".months");
const header = calendar.querySelector(".header");

const btnAdd = document.querySelector(".btn-add-event");
const btnUpdate = document.querySelector(".btn-edit-event");
const modalCreate = document.querySelector(".modal");
const modalEdit = document.querySelector(".edit");
const modalIcons = modalCreate.querySelector(".new-event-icons");
const editIcons = modalEdit.querySelector(".edit-event-icons");
const overlay = document.querySelector(".overlay");
const alert = document.querySelector(".alert");

const monthArr = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class Calendar {
  constructor(calendar) {
    this.currentMonthEl = calendar.querySelector(".month");
    this.currentYearEl = calendar.querySelector(".year");
    this.prevYearEl = calendar.querySelector(".prev-year");
    this.nextYearEl = calendar.querySelector(".next-year");
    this.months = Array.from(calendar.querySelector(".months").children);
    this.dates = calendar.querySelector(".dates");

    this.date = new Date();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
  }

  //* Rendering current month and year
  renderMonth() {
    this.currentMonthEl.textContent = monthArr[this.month];
    this.currentYearEl.textContent = this.year;
    this.months.forEach((month) => {
      month.classList.remove("current-month");
      this.months[this.month].classList.add("current-month");
    });
    this.currentYearEl.textContent = this.year;
    this.prevYearEl.innerHTML = `<i class="fa-solid fa-chevron-left"></i> ${
      this.year - 1
    }`;
    this.nextYearEl.innerHTML = `${
      this.year + 1
    } <i class="fa-solid fa-chevron-right"></i>`;

    return this;
  }
  //* Rendering dates
  renderDates() {
    const firstDayofMonth = new Date(this.year, this.month, 1).getDay();
    const lastDateofMonth = new Date(this.year, this.month + 1, 0).getDate();
    const lastDateofLastMonth = new Date(this.year, this.month, 0).getDate();
    const lastDayofMonth = new Date(
      this.year,
      this.month,
      lastDateofMonth
    ).getDay();
    let html = "";

    for (let i = firstDayofMonth; i > 0; i--) {
      html += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      const isToday =
        i === this.date.getDate() &&
        this.month === new Date().getMonth() &&
        this.year === new Date().getFullYear()
          ? "today"
          : "";
      const isOccupied = newEvent.eventsArr.some(
        (el) =>
          el.date === i && el.month === this.month && el.year === this.year
      )
        ? "occupied"
        : "";
      html += `<li class="${isToday} ${isOccupied}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      html += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    this.dates.innerHTML = html;

    cal.selected = null;
    return this;
  }
}

class Events {
  constructor(events) {
    this.eventsListEl = events.querySelector(".events-list");
    this.btnCreate = document.querySelector(".btn-create-event");
    this.eventsArr = JSON.parse(localStorage.getItem("userEvents")) || [];
    this.id = 0;
  }
  //* Saving events
  saveEvent() {
    const event = {};
    event.name = modalCreate.querySelector("#new-event-name").value || "Event";
    event.time = modalCreate.querySelector("#new-event-time").value || "12:00";
    event.date = parseInt(cal.selected.textContent);
    event.icon = modalCreate.querySelector(
      ".new-event-icons .selected"
    ).outerHTML;
    event.day = new Date(cal.year, cal.month, event.date).getDay();
    event.month = cal.month;
    event.year = cal.year;
    event.id = this.id;

    this.eventsArr.push(event);
    this.eventsArr.sort((a, b) => {
      if (a.date === b.date) return parseInt(a.time) - parseInt(b.time);
      return a.date - b.date;
    });
    this.id += 1;

    console.log(this.eventsArr);

    return this;
  }
  //* Rendering events
  renderEvent() {
    const currentEvents = this.eventsArr.filter((event) => {
      if (event.month === cal.month && event.year === cal.year) return event;
    });

    let html = "";
    currentEvents.forEach((event) => {
      const hours = event.time.split(":")[0];
      const minutes = event.time.split(":")[1];
      let time = "12";
      if (parseInt(hours) <= 12) time = `${hours}:${minutes || "00"} AM`;
      else if (parseInt(hours) === 0) time = `12:${minutes || "00"} AM`;
      else time = `${hours - 12}:${minutes || "00"} PM`;

      html += `<li class="event" id="${event.id}">
      <div class="event-icon">
      ${event.icon}</i>
      </div>
      <div class="event-details">
      <h2 class="event-name">${event.name}</h2>
      <div class="event-date">${event.date} ${dayArr[event.day]} ${time}</div>
      </div>
      <div class="event-edit">
      <button class="btn-edit">
      <i class="fa-solid fa-pen"></i>
      </button>
      <button class="btn-delete">
      <i class="fa-solid fa-trash-can"></i>
      </button>
      </div>
      </li>`;
    });

    this.eventsListEl.innerHTML = html;
    cal.renderDates();

    //* Saving events to localstorage
    localStorage.setItem("userEvents", JSON.stringify(this.eventsArr));

    return this;
  }

  //* Clearing events modal
  clearModal() {}

  //* Deleting events
  deleteEvent(id) {
    const removedEvent = this.eventsArr.findIndex((el) => el.id === id);
    this.eventsArr.splice(removedEvent, 1);
    this.renderEvent();
    cal.renderDates();
  }

  //* Editing events
  editEvent(id) {
    const editedEvent = this.eventsArr.find((el) => el.id === id);
    modalEdit.querySelector("#new-event-name").value = editedEvent.name;
    modalEdit.querySelector("#new-event-time").value = editedEvent.time;

    function updateEvent() {
      editedEvent.name = modalEdit.querySelector("#new-event-name").value;
      editedEvent.time = modalEdit.querySelector("#new-event-time").value;
      editedEvent.icon = modalEdit.querySelector(".selected").outerHTML;
      newEvent.renderEvent();
      cal.renderDates();
      modalEdit.classList.add("hidden");
      overlay.classList.add("hidden");
    }
    btnUpdate.addEventListener("mousedown", updateEvent);
    btnUpdate.addEventListener("mouseup", () => {
      btnUpdate.removeEventListener("mousedown", updateEvent);
    });
  }
}

const eventsContainer = document.querySelector(".events-tab");
const newEvent = new Events(eventsContainer);
const cal = new Calendar(calendar);
cal.renderMonth().renderDates();
newEvent.renderEvent();

//* Implementing scroll buttons for months
btns.addEventListener("click", (e) => {
  const clicked = e.target.closest("button");
  if (!clicked) return;
  else if (clicked.classList.contains("btn-prev")) {
    monthsList.scrollBy(-55, 0);
  } else if (clicked.classList.contains("btn-next")) {
    monthsList.scrollBy(55, 0);
  }
});

//* Rendering calendar on month/year change
monthsList.addEventListener("click", (e) => {
  const clicked = e.target.closest("li");
  if (!clicked) return;
  const clickedIndex = [...monthsList.children].indexOf(clicked);
  cal.month = clickedIndex;
  cal.renderMonth().renderDates();
  newEvent.renderEvent();
});

header.addEventListener("click", (e) => {
  const clicked = e.target;
  if (!clicked) return;
  if (clicked === cal.prevYearEl || clicked === cal.nextYearEl) {
    cal.year = parseInt(clicked.textContent);
  }
  cal.renderMonth().renderDates();
});

//* Selecting dates
cal.dates.addEventListener("click", (e) => {
  const clicked = e.target.closest("li:not(.inactive)");

  if (clicked) {
    cal.selected?.classList.remove("selected");
    clicked.classList.add("selected");
    cal.selected = clicked;
  }
});

//* Hide/Show modal
btnAdd.addEventListener("click", () => {
  if (!cal.selected) {
    alert.classList.remove("hidden");
    setTimeout(() => {
      alert.classList.add("hidden");
    }, 1500);
  }
  if (cal.selected) {
    modalCreate.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }
});

overlay.addEventListener("click", () => {
  modalCreate.classList.add("hidden");
  modalEdit.classList.add("hidden");
  overlay.classList.add("hidden");
});

//* Create new event
newEvent.btnCreate.addEventListener("click", () => {
  newEvent.saveEvent().renderEvent();
  modalCreate.classList.add("hidden");
  overlay.classList.add("hidden");

  modalCreate.querySelectorAll("input").forEach((el) => {
    el.value = "";
  });
});

//* Delete/Edit event
newEvent.eventsListEl.addEventListener("click", (e) => {
  if (e.target.closest("button").classList.contains("btn-delete")) {
    const eventId = parseInt(e.target.closest(".event").id);
    newEvent.deleteEvent(eventId);
  }
  if (e.target.closest("button").classList.contains("btn-edit")) {
    modalEdit.classList.remove("hidden");
    overlay.classList.remove("hidden");
    const eventId = parseInt(e.target.closest(".event").id);
    newEvent.editEvent(eventId);
  }
});

[modalIcons, editIcons].forEach((el) => {
  el.addEventListener("click", (e) => {
    if (e.target.tagName === "I") {
      el.querySelector(".selected")?.classList.remove("selected");
      e.target.classList.add("selected");
    }
  });
});
