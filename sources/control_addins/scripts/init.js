const options = {
  usageStatistics: false,
  defaultView: "week",
  useFormPopup: true,
  useDetailPopup: true,
  week: {
    startDayOfWeek: 1,
    workweek: true,
    showNowIndicator: true,
    hourStart: 7,
    hourEnd: 20,
    taskView: false,
    collapseDuplicateEvents: false,
  },
  calendars: [
    {
      id: "cal1",
      name: "Personal",
      backgroundColor: "#90ee90",
    },
    {
      id: "cal2",
      name: "Work",
      backgroundColor: "#e0ffff",
    },
    {
      id: "cal3",
      name: "Day off",
      backgroundColor: "#ffffe0",
    },
    {
      id: "cal4",
      name: "Emergency",
      backgroundColor: "#ffa07a",
    },
  ],
  theme: {
    week: {
      nowIndicatorLabel: {
        color: "red",
      },
      nowIndicatorToday: {
        border: "1px solid red",
      },
    },
  },
};

var tuiCalendar = tui.Calendar;
var calendar = null;