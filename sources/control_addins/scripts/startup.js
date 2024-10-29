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
<div id='tooltip-message' hidden><article class='message is-info is-small'><div id='tooltip-header' class='message-header'></div><div id='tooltip-body' class='message-body'></div></article></div>"

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

const tooltip = document.querySelector('#tooltip-message');
const tooltip_header = document.querySelector('#tooltip-header');
const tooltip_body = document.querySelector('#tooltip-body');

// This event listener should be debounced or it may affect the performance.
document.addEventListener('mouseover', (e) => {
  const el = e.target;

  // You need to choose a different selector for schedules in the other view.
  const eventAllDay = el.closest('.toastui-calendar-weekday-event');

  if (eventAllDay) {
    let eventTitleSpan = '';
    let calData = {};
    const selectors = eventAllDay.querySelectorAll('span');
    eventTitleSpan = [...selectors].map(span => span.innerText);//.replace(/"/g,""));
    calData = calendarData.find((el) => el.title === eventTitleSpan[2]);
    tooltip_header.innerHTML = calData.title;
    tooltip_body.innerHTML = new Date(calData.start).toLocaleString() + "<br>" + new Date(calData.end).toLocaleString();
    
    eventAllDay.addEventListener(
      'mouseleave',
      () => {
        tooltip.hidden = true;
      },
      { once: true }
    );

    const {
      x,
      width,
      bottom
    } = eventAllDay.getBoundingClientRect();
    tooltip.hidden = false;
    Object.assign(tooltip.style, {
      top: `${bottom}px`,
      left: `${x + Math.round(width / 2)}px`,
    });
  }

  const calEvent = el.closest('.toastui-calendar-event-time');

  if (calEvent) {
    let eventTitleSpan = '';
    let calData = {};
    const selectors = calEvent.querySelectorAll('span');
    eventTitleSpan = [...selectors].map(span => span.innerText);//.replace(/"/g,""));
    calData = calendarData.find((el) => el.title === eventTitleSpan[1]);
    tooltip_header.innerHTML = calData.title;
    tooltip_body.innerHTML = new Date(calData.start).toLocaleString() + "<br>" + new Date(calData.end).toLocaleString();

    calEvent.addEventListener(
      'mouseleave',
      () => {
        tooltip.hidden = true;
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
    Object.assign(tooltip.style, {
      top: `${y + height/2}px`,
      left: `${x + Math.round(width / 2)}px`,
    });
  }
});