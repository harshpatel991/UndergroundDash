//Load the widget configuration from saved values

let Parser = require('rss-parser');
let parser = new Parser();
const Store = require('electron-store');
var debounce = require('debounce');

const store = new Store();

var data = {
    showWidgets: false, //hides the widgets initially so they don't flash on the screen
    isMouseDown: false,
    dragWidgetListName: '',
    dragWidgetListIndex: 0,
    remove_mode: false,
    is_menu_open: false,
    clocks: [],
    stickynotes: [],
    rsses: [],
    calendars: [],
    weathers: [],

    cities: [
        {id: 'US/Samoa', name: 'Samoa'},
        {id: 'US/Hawaii', name: 'Hawaii'},
        {id: 'US/Alaska', name: 'Alaska'},
        {id: 'America/Anchorage', name: 'Anchorage'},
        {id: 'America/Denver', name: 'Denver'},
        {id: 'America/Chicago', name: 'Chicago'},
        {id: 'America/New_York', name: 'New York'},
        {id: 'America/Bogota', name: 'Bogota'},
        {id: 'America/Caracas', name: 'Caracas'},
        {id: 'America/Argentina/Buenos_Aires', name: 'Buenos Aires'},
        {id: 'Atlantic/Azores', name: 'Azores'},
        {id: 'Europe/London', name: 'London'},
        {id: 'Europe/Amsterdam', name: 'Amsterdam'},
        {id: 'Europe/Athens', name: 'Athens'},
        {id: 'Asia/Baghdad', name: 'Baghdad'},
        {id: 'Asia/Calcutta', name: 'Calcutta'},
        {id: 'Asia/Almaty', name: 'Almaty'},
        {id: 'Asia/Bangkok', name: 'Bangkok'},
        {id: 'Asia/Chongqing', name: 'Chongqing'},
        {id: 'Asia/Hong_Kong', name: 'Hong Kong'},
        {id: 'Asia/Seoul', name: 'Seoul'},
        {id: 'Australia/Brisbane', name: 'Brisbane'},
        {id: 'Asia/Magadan', name: 'Magadan'},
        {id: 'Pacific/Auckland', name: 'Auckland'}
    ]
};

function loadInitialData() {
    var loadedData = store.get('data');
    if(typeof loadedData !== 'undefined' ) {
        data = loadedData;
    }
    data.showWidgets = true;
};

loadInitialData();

var mainController = {
    toggleMenu: function (e, model) {
        data.is_menu_open = !data.is_menu_open;
        data.remove_mode = false;
        saveDebounced();
    },

    toggleDeleteMode: function (e, model) {
        data.remove_mode = !data.remove_mode;
        saveDebounced();
    },






    elementDrag: function (e, model) {
        if (data.isMouseDown) {
            e.preventDefault();
            saveDebounced();
            model.data[data.dragWidgetListName][data.dragWidgetListIndex].top = (e.clientY - data.mouseYOffset) + "px";
            model.data[data.dragWidgetListName][data.dragWidgetListIndex].left = (e.clientX - data.mouseXOffset) + "px";
        }
    },
    closeDragElement: function (e, model) {
        data.isMouseDown = false;
        saveDebounced();
    },


};

mainController = {...mainController, ...clockController, ...stickynoteController, ...rssController, ...weatherController, ...calendarController};

function widgetMouseDown(e, model, widgetListName) {
    data.mouseXOffset = e.clientX - e.currentTarget.offsetLeft;
    data.mouseYOffset = e.clientY - e.currentTarget.offsetTop;
    data.dragWidgetListIndex = model.index;
    data.dragWidgetListName = widgetListName;
    data.isMouseDown = true;
}

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

//TODO: cron to refresh only if elapsed time > 30 mins

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

var saveDebounced = debounce(saveData, 200);

function saveData() {
    store.set('data', data);
}

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