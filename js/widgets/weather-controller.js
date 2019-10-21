var weatherController = {
    // weather widget
    addWeather: function (e, model) {
        model.data.weathers.push({top: "135px", left: "784px", location: '', currentTemperature: '', currentCode: 1, forecasts: [{day: "Mon", high: 80, low: 60, text: "Mostly Sunny"}], settings: {location: 'Chicago, IL', unit: 'F', open: false}});
        refreshWeather();
        saveDebounced();
    },
    removeWeather: function (e, model) {
        model.data.weathers.splice(model.index, 1);
        saveDebounced();
    },
    showWeatherSettings: function (e, model) {
        model.data.weathers[model.index].settings.open = true;
    },
    saveWeather: function (e, model) {
        model.data.weathers[model.index].settings.open = false;
        refreshWeather();
        saveDebounced();
    },
    weatherMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'weathers');
    },
};