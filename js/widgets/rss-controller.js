var rssController = {
    // rss widget
    addRss: function (e, model) {
        model.data.rsses.push({maxItemsCount: 5, items: [{title: "", source: ""}]});
        saveDebounced();
        refreshRss();
    },
    removeRss: function (e, model) {
        model.data.rsses.splice(model.index, 1);
        saveDebounced();
    },
    showRssSettings: function (e, model) {
        //None
    },
    closeRssSettings: function (e, model) {
        //None
    },
    saveRss: function (e, model) {
        //None
    },
    rssMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'rsses');
    },
    refreshRss: function (e, model) {
        refreshRss();
    },
};