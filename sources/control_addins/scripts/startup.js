var controlAddIn = document.getElementById("controlAddIn");

if (!controlAddIn) {
  console.error('Cannot found element controlAddIn');
  return;
}

var parentBody = controlAddIn.parentNode;
if (parentBody) {
  parentBody.style.overflow = "scroll";
}

Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("OnControlAddInReady", "");

controlAddIn.innerHTML = "<nav class='navbar'> \
  <button type='button' class='button is-link' \
    onclick='window.gotoToday()'>Today</button> \
  <button class='button is-link is-light' onclick='window.gotoPrevWeek()'> \
    <span class='material-symbols-outlined'> \
      arrow_circle_left \
      </span> \
  </button> \
  <button class='button is-link is-light' onclick='window.gotoNextWeek()'> \
    <span class='material-symbols-outlined'> \
      arrow_circle_right \
      </span> \
  </button> \
  <span id='calendarDateRange' class='subtitle is-3'></span> \
</nav> \
<div id='calendarFrame' style='height: 650px;'></div> \
<div class='notification is-success is-light' id='tooltip' hidden><button class='delete'></button></div>"

calendar = new tuiCalendar('#calendarFrame', options);
let dateStart = new Date(calendar.getDateRangeStart());
let dateEnd = new Date(calendar.getDateRangeEnd());
document.getElementById("calendarDateRange").innerHTML =
  dateStart.toLocaleDateString() + " ~ " + dateEnd.toLocaleDateString();

calendar.createEvents(calendarData);

calendar.render();

window.gotoToday = function () {
  calendar.today();
  dateStart = new Date(calendar.getDateRangeStart());
  dateEnd = new Date(calendar.getDateRangeEnd());
  document.getElementById("calendarDateRange").innerHTML =
    dateStart.toLocaleDateString() + " ~ " + dateEnd.toLocaleDateString();
};

window.gotoNextWeek = function () {
  calendar.next();
  dateStart = new Date(calendar.getDateRangeStart());
  dateEnd = new Date(calendar.getDateRangeEnd());
  document.getElementById("calendarDateRange").innerHTML =
    dateStart.toLocaleDateString() + " ~ " + dateEnd.toLocaleDateString();
};

window.gotoPrevWeek = function () {
  calendar.prev();
  dateStart = new Date(calendar.getDateRangeStart());
  dateEnd = new Date(calendar.getDateRangeEnd());
  document.getElementById("calendarDateRange").innerHTML =
    dateStart.toLocaleDateString() + " ~ " + dateEnd.toLocaleDateString();
};

calendar.on("beforeUpdateEvent", ({ event, changes }) => {
  console.log("beforeUpdateEvent", event.id);
  console.log("beforeUpdateEvent", changes);
  
  console.log("firing InvokeExtensibilityMethod");
  Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("UpdateEvent", [event.id.toString(), changes]);
  calendar.updateEvent(event.id, event.calendarId, changes);
});

calendar.on("beforeDeleteEvent", (eventObj) => {
  console.log("beforeDeleteEvent", eventObj.id);
  calendar.deleteEvent(eventObj.id, eventObj.calendarId);
  Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("DeleteEvent", [eventObj.id.toString()]);
});

calendar.on('beforeCreateEvent', (eventObj) => {
  console.log("beforeCreateEvent", eventObj);
  Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("AddEvent", [eventObj]);
  calendar.createEvents([
    {
      ...eventObj,
      id: self.crypto.randomUUID(),
    },
  ]);
});

const tooltip = document.querySelector('#tooltip');
console.log("tooltip", tooltip);
// This event listener should be debounced or it may affect the performance.
document.addEventListener('mouseover', (e) => {
  const el = e.target;
  console.log("mouseover", e);

  // You need to choose a different selector for schedules in the other view.
  const scheduleAllDay = el.closest('.toastui-calendar-weekday-event');
  console.log("mouseover", scheduleAllDay);

  if (scheduleAllDay) {
    console.log("mouseover", scheduleAllDay);
    scheduleAllDay.addEventListener(
      'mouseleave',
      () => {
        tooltip.hidden = true;
        tooltip.innerHTML = scheduleAllDay.innerHTML;
        console.log("mouseleave", tooltip);
      },
      { once: true }
    );

    const {
      x,
      width,
      bottom: scheduleBottom,
      y,

    } = scheduleAllDay.getBoundingClientRect();
    tooltip.hidden = false;
    tooltip.innerHTML = scheduleAllDay.innerHTML;
    console.log("mouseover", tooltip);
    Object.assign(tooltip.style, {
      top: `${scheduleBottom}px`,
      left: `${x + Math.round(width / 2)}px`,
    });
  }

  const calEvent = el.closest('.toastui-calendar-event-time');

  if (calEvent) {
    calEvent.addEventListener(
      'mouseleave',
      () => {
        tooltip.hidden = true;
        tooltip.innerHTML = calEvent.innerHTML;
      },
      { once: true }
    );

    const {
      x,
      width,
      y,
      height 
    } = calEvent.getBoundingClientRect();
    tooltip.hidden = false;
    tooltip.innerHTML = calEvent.innerHTML;
    Object.assign(tooltip.style, {
      top: `${y + height/2}px`,
      left: `${x + Math.round(width / 2)}px`,
    });
  }
});