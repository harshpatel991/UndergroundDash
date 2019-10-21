var stickynoteController = {
    addStickynote: function (e, model) {
        model.data.stickynotes.push({left: 400, top: 400, text: ''});
        saveDebounced();
    },
    removeStickynote: function (e, model) {
        model.data.stickynotes.splice(model.index, 1);
        saveDebounced();
    },
    showStickynoteSettings: function (e, model) {
        //None
    },
    closeStickynoteSettings: function (e, model) {
        //None
    },
    changeStickynoteText: function (e, model) {
        saveDebounced();
    },
    saveStickynote: function (e, model) {
        //None
    },
    stickynoteMouseDown: function (e, model) {
        widgetMouseDown(e, model, 'stickynotes');
    }
};