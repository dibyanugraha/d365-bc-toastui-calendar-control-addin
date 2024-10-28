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
<div id='tooltip' hidden>I'm tooltip</div>"

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