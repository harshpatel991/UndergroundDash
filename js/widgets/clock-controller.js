var clockController = {
    addClock: function (e, model) {
        model.data.clocks.push({left: "300px", top: "300px", city: {id: 'America/New_York', name: 'New York'}});
        refreshTime();
        saveDebounced();
    },
    removeClock: function (e, model) {
        model.data.clocks.splice(model.index, 1);
        saveDebounced();
    },
    showClockSettings: function (e, model) {
        model.data.clocks[model.index].settings_open = true;
    },
    // Save widget settings
    saveClock: function (e, model) {
        model.data.clocks[model.index].settings_open = false;
        saveDebounced();
    },
    clockMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'clocks');
    },
    selectClockCity: function (e, model) {
        model.data.clocks[model.index].city = {id: e.currentTarget.value, name: e.currentTarget.options[e.currentTarget.selectedIndex].text};
    }
};