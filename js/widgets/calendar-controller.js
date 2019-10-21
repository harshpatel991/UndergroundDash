var calendarController = {
    // calendar widget
    addCalendar: function (e, model) {
        model.data.calendars.push({ currentDay: 1, currentMonth: 1, selectedMonth: 1, selectedYear: 2000});
        saveDebounced();
        refreshCalendar();
    },
    removeCalendar: function (e, model) {
        model.data.calendars.splice(model.index, 1);
        saveDebounced();
    },
    showCalendarSettings: function (e, model) {
        //None
    },
    closeCalendarSettings: function (e, model) {
        //None
    },
    saveCalendar: function (e, model) {
        //None
    },
    calendarMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'calendars');
    },
};