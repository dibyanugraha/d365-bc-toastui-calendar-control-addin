function RetrieveData(eventData) {
  console.log("eventData", eventData);

  if (!calendar) {
    console.log("refresh", 'calendar is missing. exiting.');
    return;
  } 

  calendarData.length = 0;
  const obj = JSON.parse(eventData);
  calendarData = obj;

  console.log("calendarData", calendarData);
  calendar.clear();
  calendar.createEvents(calendarData);

  calendar.render();
}
