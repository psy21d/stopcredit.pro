UI.registerHelper('indexed', function(context, options) {
    var that = this;
    if (context) {
        return context.map(function(item, index) {
            item._index = index + 1;
            item._parent = that;
            _.each(options.hash, function(val,key) {
                item[key] = val;
            });
            return item;
        });
    }
});

buildRegExp = function(searchText) {
    // this is a dumb implementation
    var parts = searchText.trim().split(/[ \-\:]+/);
    return new RegExp("(" + parts.join('|') + ")", "ig");
};

f0f = function(num) {
    num = num.toString();
    if (num.length == 1) { num = "0" + num };
    return num;
};

UI.registerHelper('addedFormatted',function(timestamp) {
    var monthNames = [
        "Января", "Февраля", "Марта",
        "Апреля", "Мая", "Июня", "Июля",
        "Августа", "Сентября", "Октября",
        "Ноября", "Декабря"
    ];

    var date = new Date(Number(timestamp));
    var hours = date.getHours();
    hours = f0f(hours);
    var minutes = date.getMinutes();
    minutes = f0f(minutes);
    var seconds = date.getSeconds();
    seconds = f0f(seconds);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return {
        "date" : day + " " + monthNames[monthIndex] + " " + year,
        "time" : hours + ":" + minutes + ":" + seconds
    };
});

UI.registerHelper('checkOpsos',function(phone) {
    return false;
    var re_p = /([0-9]+).*?([0-9]+).*?([0-9]+).*?([0-9]+).*?([0-9]+).*?([0-9]+).*?/;
    var match = re_p.exec(phone);
    match[0]="";
    var newn = match.join("");
    if ((newn[0] == 7) || (newn[0] == 8)) {
        newn= newn.slice(1,100)
    }
    newn = Number(newn);
    var opSos = Operators.findOne({
        $and : [ { start : { $lt : newn+1 } } , { end : { $gt : newn-1 } } ]
    });
    if (opSos)
        return opSos;
    else
        return false;
});

UI.registerHelper('finditem',function(where,what) {
    //console.log(where);
    //console.log(what);
    return _.where(where, {"type":what});
});

UI.registerHelper('equals',function(v1, v2) {
    return (v1 === v2);
});


UI.registerHelper('show_systems_commentaries', function() {
    return show_systems_commentaries;
});


