//Load the widget configuration from saved values

let Parser = require('rss-parser');
let parser = new Parser();

var data = {
    dragWidgetListName: '',
    dragWidgetListIndex: 0,
    remove_mode: false,
    is_menu_open: false,
    widgets: [
        {
            title: 'clock',
            region_to_city_options: {asia: ['abu_dhabi'], africa: ['ababa', 'blah_city']}
        },
        {
            title: 'sticky_note'
        }
    ],
    clocks: [{left: "100px", top: "100px", city: {id: 'America/New_York', name: 'New York'}, settings_open: false, value: ''}, {left: "200px", top: "200px", city: {id: 'America/Chicago', name: 'Chicago'}, settings_open: false, value: ''}],
    stickynotes: [{left: "150px", top: "150px", text: 'hello world'}, {left: "300px", top: "300px", text: 'blah blah'}],
    rsses: [{maxItemsCount: 5, items: [{title: "", source: ""}]}],
    calendars: [{ currentDay: 1, currentMonth: 1, selectedMonth: 1, selectedYear: 2000}],
    weathers: [{top: "135px", left: "784px", location: '', currentTemperature: '', currentCode: 1, forecasts: [{day: "Mon", high: 80, low: 60, text: "Mostly Sunny"}], settings: {location: 'Chicago, IL', unit: 'F', open: false}}],

    cities: [{id: 'America/New_York', name: 'New York'}, {id: 'America/Chicago', name: 'Chicago'}]

};

var mainController = {
    toggleMenu: function (e, model) {
        data.is_menu_open = !data.is_menu_open;
    },

    toggleDeleteMode: function (e, model) {
        data.remove_mode = !data.remove_mode;
    },

    // Clock widget
    addClock: function (e, model) {
        model.data.clocks.push({left: "300px", top: "300px", city: {id: 'America/New_York', name: 'New York'}}); //TODO: find from user's region?
        refreshTime();
    },
    removeClock: function (e, model) {
        model.data.clocks.splice(model.index, 1);
    },
    showClockSettings: function (e, model) {
        model.data.clocks[model.index].settings_open = true;
    },
    closeClockSettings: function (e, model) {
        model.data.clocks[model.index].settings_open = false;
    },
    // Save widget settings
    saveClock: function (e, model) {
        console.log('save' + JSON.stringify(model.data.clocks[model.index]));
    },
    clockMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'clocks');
    },
    selectClockCity: function (e, model) {
        model.data.clocks[model.index].city = {id: e.currentTarget.value, name: e.currentTarget.options[e.currentTarget.selectedIndex].text};
    },

    // stickynote widget
    addStickynote: function (e, model) {
        model.data.stickynotes.push({left: 400, top: 400, text: ''});
    },
    removeStickynote: function (e, model) {
        model.data.stickynotes.splice(model.index, 1);
    },
    showStickynoteSettings: function (e, model) {
        //None
    },
    closeStickynoteSettings: function (e, model) {
        //None
    },
    saveStickynote: function (e, model) {
        console.log('save' + JSON.stringify(model.data.stickynotes[model.index]));
    },
    stickynoteMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'stickynotes');
    },

    // rss widget
    addRss: function (e, model) {
        model.data.rsses.push({maxItemsCount: 5, items: ['HeadlineA', 'HeadlineB', 'HeadlineC']});
    },
    removeRss: function (e, model) {
        model.data.rsses.splice(model.index, 1);
    },
    showRssSettings: function (e, model) {
        //None
    },
    closeRssSettings: function (e, model) {
        //None
    },
    saveRss: function (e, model) {
        console.log('save' + JSON.stringify(model.data.rsses[model.index]));
    },
    rssMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'rsses');
    },
    refreshRss: function (e, model) {
        console.log("refresh rss");
        refreshRss();
    },

    // calendar widget
    addCalendar: function (e, model) {
        model.data.calendars.push({currentDay: 1, currentMonth: 1, currentYear: 2000, selectedMonth: 1, selectedYear: 2000, value: []});
    },
    removeCalendar: function (e, model) {
        model.data.calendars.splice(model.index, 1);
    },
    showCalendarSettings: function (e, model) {
        //None
    },
    closeCalendarSettings: function (e, model) {
        //None
    },
    saveCalendar: function (e, model) {
        console.log('save' + JSON.stringify(model.data.calendars[model.index]));
    },
    calendarMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'calendars');
    },

    // weather widget
    addWeather: function (e, model) {
        model.data.weathers.push({top: "135px", left: "784px", location: '', currentTemperature: '', currentCode: 1, forecasts: [{day: "Mon", high: 80, low: 60, text: "Mostly Sunny"}], settings: {location: 'Chicago, IL', unit: 'F', open: false}});
        refreshWeather();
    },
    removeWeather: function (e, model) {
        model.data.weathers.splice(model.index, 1);
    },
    showWeatherSettings: function (e, model) {
        model.data.weathers[model.index].settings.open = true;
    },
    closeWeatherSettings: function (e, model) {
        model.data.weathers[model.index].settings.open = false;
    },
    saveWeather: function (e, model) {
        model.data.weathers[model.index].settings.open = false;
        refreshWeather();
    },
    weatherMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'weathers');
    },

    elementDrag: function (e, model) {
        if (data.isMouseDown) {
            e.preventDefault();

            model.data[data.dragWidgetListName][data.dragWidgetListIndex].top = (e.clientY - data.mouseYOffset) + "px";
            model.data[data.dragWidgetListName][data.dragWidgetListIndex].left = (e.clientX - data.mouseXOffset) + "px";
        }
    },
    closeDragElement: function (e, model) {
        data.isMouseDown = false;
    },


};

function widgetMouseDown(e, model, widgetListName) {
    data.mouseXOffset = e.clientX - e.currentTarget.offsetLeft;
    data.mouseYOffset = e.clientY - e.currentTarget.offsetTop;
    data.dragWidgetListIndex = model.index;
    data.dragWidgetListName = widgetListName;
    data.isMouseDown = true;
}

rivets.formatters.formatCalendar = function(calendar) {

};

function refreshCalendar() {

    data.calendars.forEach(function (calendar) {
        var d = moment();
        calendar.currentDay = d.date();
        calendar.currentMonth = d.month();
        calendar.currentDayOfWeek = d.format('dddd');

        var selectedYear = d.year(); //for now, the selected year is current year
        var selectedMonth = d.month(); //for now, the selected month is the current month

        let firstDay = (new Date(selectedYear, selectedMonth)).getDay();

        let date = 1;
        let rows = [];
        for (let i = 0; i < 6; i++) {
            // creates a table row
            let row = [];

            //creating individual cells, filing them up with data.
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    row.push("");
                } else if (date > (32 - new Date(selectedYear, selectedMonth, 32).getDate())) {
                    break;
                } else {
                    row.push(date);
                    date++;
                }
            }
            rows.push(row);
        }
        calendar.value = rows;
    });
}

refreshCalendar();

rivets.formatters.length = function(val) {
    return val.length;
};

rivets.binders.draggablex = function(el, value) {
    el.style.left = value;
};

rivets.binders.draggabley = function(el, value) {;
    el.style.top = value;
};

refreshTime = function(){
    data.clocks.forEach(function (element) {
        let time = moment().tz(element.city.id).format('h:mm:ss A');
        element.value = time;
    });

    setTimeout(this.refreshTime, 500);
};

refreshTime();

function refreshRss() {
    data.rsses.forEach(function (element) {
        element.items = ["Refreshing..."];
        (async () => {
            let feed = await parser.parseURL('https://news.google.com/news/rss/headlines?ned=');
            element.items = [];
            for (var i = 0; (i < feed.items.length) && (i < 5); i++) {
                var lastIndexDash = feed.items[i].title.lastIndexOf('-');
                var title = feed.items[i].title.substr(0, lastIndexDash);
                var source = feed.items[i].title.substr(lastIndexDash);
                element.items.push({title: title, source: source});
            }
        })();
    });
}

refreshRss();

function refreshWeather() {
    data.weathers.forEach(function (element) {

        fetch('http://roastmygame.com/weather?location=' + element.settings.location).then(
            data => { return data.json();  }
        ). then(data => {
            element.currentTemperature = data.current_observation.condition.temperature;
            element.currentCode = data.current_observation.condition.code;
            element.location = data.location.city + ', ' + data.location.region;
            element.forecasts = data.forecasts.slice(0, 7);
        } );

    });
}

refreshWeather();

//TODO: need to refresh calendar

rivets.binders['set-weather-class'] = function(el, value){
    el.className += ' wi-yahoo-'+ value;
};

rivets.formatters.eq = function(value, checkAgainst)
{
    return (value == checkAgainst);
}

rivets.bind(
    document,
    {
        data: data,
        controller: mainController
    }
);