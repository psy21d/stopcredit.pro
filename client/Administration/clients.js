var getClients_default = {
    find:{
        status:"new"
    }
};

    ClientsController = AppController.extend({
        // template: 'home',

        // layoutTemplate: 'layout',
        waitOn: function () {
            Session.set('clientsRequests',getClients_default);

            return Meteor.subscribe('clients', getClients_default);
        },

        /**
         * @desc : Called when the route is first run. It is not called again
         * if the route reruns because of a computation invalidation.
         */
        onRun: function () {
            console.log('Method onRun');
            if (!(Meteor.user() || Meteor.loggingIn())) {
                this.redirect('/');
            }
            else{
                this.next();
            }

        },

        /**
         * @desc : Called if the route reruns because its computation is invalidated.
         */
        onRerun: function () {
            this.next();
        },

        load: function () {
            this.next();
        },

        /**
         * @desc : Called before the route or "action" function is run. These hooks
         * behave specially. If you want to continue calling the next function you
         * must call this.next(). If you don't, downstream onBeforeAction hooks and
         * your action function will not be called.
         */
        onBeforeAction: function () {

            this.next();
        },

        before: function () {
            this.next();
        },

        action: function () {
            Session.set('Template','A_clients');
            this.render();
        },

        /**
         * @desc : Called after your route/action function has run or had a chance to run.
         * These hooks behave like normal hooks and you don't need to call this.next()
         * to move from one to the next.
         */
        onAfterAction: function () {
            console.log('Method onAfterAction');
        },

        after: function () {
            console.log('Method after');
        },

        /**
         * @desc : Access this data from the associated template.
         */
        data: function () {
            console.log('Method data');
            return {};
        },

        /**
         * @desc : Called when the route is stopped, typically right before a new route is run.
         */
        /*
         stop: function () {
         console.log('Method stop');
         // return false;
         this.next();
         },
         */

        /**
         * @desc : This is called when you navigate to a new route
         */
        unload: function () {
            console.log('Method unload -------------------------------');
            console.log('');
            // this.next();
            return '';
        }

    });


Template.A_clients.helpers({
    isrole:function(){

        if ((Meteor.users.findOne(Meteor.userId()) && (Roles.userIsInRole(Meteor.userId(), ['admin'])))) {
            return true
        }
        else{
            return false
        }

    },
    manager:function(){
        var owner_client = Session.get('Owner_client');
        if (owner_client){
            var result = Meteor.users.findOne({"_id":owner_client});
            if (result.profile){
                if (result.profile.fio){
                    return result.profile.fio
                }
                else {
                    return "Администратор"
                }

            }
            else if (result){
                return "Администратор"
            }
            return result
        }

    },
    managers: function(){
        var List_managers = Meteor.users.find({"roles":{'$in':["manager"]}}).fetch()
        var data = {
            list_managers:List_managers,
            context_request:this
        }
        return data
    },
    'current_manager':function(){
        var managerId = Session.get('Owner_client')


        if (!managerId) return

        Session.set('list_Managers', this.list_managers)

        var list_managers = Session.get('list_Managers')


        for (var i=0; i < list_managers.length; i++){
            if (list_managers[i]._id == managerId){
                list_managers[i].selected = true
            }
        }
        return list_managers
    },
    client_dates: function() {
        //Использовать календарь
        var have_calendar = Session.get('use_clients_calendar');
        var range = Session.get('clients_calendar_range');
        if ((have_calendar) && (range)) { return range } else {
            return "Использовать календарь";
        }
    },
    clients: function () {

        //return Clients.find({'status': {$in : Session.get('to_find')}});
        var query = {
            "$and":[]
        }
        var to_search =  Session.get('to_search_client');
        var status = Session.get('status_client');
        if (status){
            query["$and"].push({status:status})
        }

        var filter = Session.get('clients_filter')
        if (filter){
            if (filter.filter.manager != ""){
                query["owner"] = filter.filter.manager
            }
        }

        var start = 0;
        var end   = 9999999900000;

        var have_calendar = Session.get('use_clients_calendar');
        if (have_calendar) {
                start = Session.get('clients_date_start');
                end   = Session.get('clients_date_end');
        }

        if ((!to_search) || (to_search.length < 3))
        {
            query["$and"].push(
                { added: { $gte: start } },
                { added: { $lte: end   } }
            )
            console.log(query)
            return Clients.find(query);
        }

        var regExp = buildRegExp(to_search);

        var found = Clients.find(
            {$and : [
                {$or:
                    [
                        {
                            contacts: {
                                $elemMatch: {
                                    content: regExp
                                }
                            }
                        },
                        {
                            info: {
                                $elemMatch: {
                                    content: regExp
                                }
                            }
                        }
                    ]},
                { added: { $gte: start } },
                { added: { $lte: end   } }
            ]
            }).fetch();


        if (found)   {
            Session.set('clients_found_n',found.length)
        }

        return found;
    },
    clients_selected: function() {
        return Session.get('client_selected');
    },
    clients_is_selected: function() {
        if (Session.get('client_selected'))
        {
            return Session.get('client_selected').id == this._id;
        } else {
            return null
        }
    },
    selectedClient: function () {
        if (Session.get('client_selected')) {
            return Clients.findOne(Session.get('client_selected').id);
        } else {
            return null;
        }
    },
    use_clients_calendar: function() {
        return Session.get('use_clients_calendar');
    },
    request: function() {
        return Requests.findOne(this.id);
    }
});

Template.A_clients.events({
    'change .filter_manager':function(event, template){
        var ManagerId = $(event.target).val();

        var filter = {
            filter:{
                manager:ManagerId
            }
        }

        Session.set('clients_filter', filter );


    },
    'change .list_managers' : function(event,template){

        var ManagerId = $(event.target).val();

        var client_selected = Session.get('client_selected');
        if (ManagerId && client_selected){
            Clients.update({"_id":client_selected.id}, {$set:{"owner": ManagerId}});
            Session.set('Owner_client', ManagerId)

        }



    },
    'click .status_client' : function(event, template){
        Session.set('status_client',$(event.target).val())
    },
    'click .client-item': function (event,template) {
        event.stopPropagation();
        console.log(this)
        var clients_selected = {
            id : this._id,
            role : "info"
        };

        var Manager_id  = this.owner
        if (Manager_id){
            Session.set('Owner_client', Manager_id)
        }

        if ((Session.get('client_selected') != null) &&
            (Session.get('client_selected').id == clients_selected.id))
        {
            Session.set('Owner_client', null)
            Session.set('client_selected',null);
        } else {
            Session.set('client_selected',clients_selected);
        }
        $(".input_line_type").removeClass('alerted');
        $(".input_line_content").removeClass('alerted');
        // Session.set('to_search_client',null);
    },
    'keyup #client_search_input': function(event,template) {
        var to_search = event.target.value;
        Session.set('to_search_client',to_search);
        var parts = to_search.trim().split(/[ \-\:]+/);
        setTimeout(function(){
            $('.client-item').unhighlight();
            _.each(parts,function (e,n) {
                $('.client-item').highlight(e);
            });
        },1600);
    },
    'click .enable_calendar':function(event,template) {
        var use = Session.get('use_clients_calendar');
        if (use) {
            Session.set('use_clients_calendar',false);
            $('.pick_calendar_clients').hide();
        } else {
            $('.pick_calendar_clients').show();
            Session.set('use_clients_calendar',true);
            if (Session.get('have_clients_calendar')) {return};
            var _5_days	= new Date;
            _5_days.addDays(-5);
            var clients_calendar = $('.pick_calendar_clients').pickmeup({
                flat		: true,
                date		: [
                    _5_days,
                    new Date
                ],
                mode		: 'range',
                calendars	: 2,
                trigger_event : 'clients_calendar_pick'
            });
            Session.set('have_clients_calendar',true);
        }
    },
    'click .pick_calendar_clients':function(event,template) {
        var range = $('.pick_calendar_clients').pickmeup('get_date');
        if (!range) {
            Session.set('clients_calendar_range',"Выберите даты")
        } else {
            var start = range[0].getTime();
            var end   = range[1].getTime();
            end = new Date(end);
            end.addDays(1);
            end = end.getTime();
            Session.set('clients_date_start',start);
            Session.set('clients_date_end',end);
            end   = range[1].getTime();
            start = UI._globalHelpers.addedFormatted(start);
            end   = UI._globalHelpers.addedFormatted(end);
            Session.set('clients_calendar_range',start.date + " — " + end.date);
        }
    },
    'click .button_add_item': function(event,template) {
        var item = event.target.getAttribute("item");
        var input_line_type = $(".input_line_type[item='" + item + "'][action='add']").val();
        var input_line_content = $(".input_line_content[item='" + item +"'][action='add']").val();

        var add = {
            "type"   : input_line_type,
            "content": input_line_content
        };

        var updater = {};
        updater['$addToSet'] = {};
        updater['$addToSet'][item] = add;

        Clients.update(this._id,updater,function(err,newid)
        {
            if ((!err) && (newid))
            {
                $(".input_line_type[item='" + item + "'][action='add']").val('');
                $(".input_line_content[item='"+ item +"'][action='add']").val('');
                addCommentary({
                    "_log" : "Добавлен элемент",
                    "field": item,
                    "line" : add
                })
            } else {
                if (err == undefined) {err = "Done nothing!"}
                var show_err = {
                    source: "Requests form. Update client " + item + ". ",
                    error: err.toString()
                };
                Session.set('administration_error',show_err);
            }
        });
    },
    'click .button_del': function(event,template) {
        var that = this;
        var updater = {};

        var del = {
            "type"   : this.type,
            "content": this.content
        };

        updater['$pull'] = {};
        updater['$pull'][this._source] = del;

        Clients.update(this._parent._id,updater,function(err,newid)
        {
            if ((!err) && (newid))
            {
                addCommentary({
                    "_log" : "Удалён элемент",
                    "field": that._source,
                    "line" : del
                })
            } else {
                if (err == undefined) {err = "Done nothing!"}
                var show_err = {
                    source: "Requests form. Update client " + that._source + ". ",
                    error: err.toString()
                };
                Session.set('administration_error',show_err);
            }
        });
    },
    'click .button_ok': function(event,template) {
        var that = this;
        var item = event.target.getAttribute("item");

        var updater = {};

        var input_line_type = $(".input_line_type[item='" + item + "'][i='"+ this._index+"']").val();
        var input_line_content = $(".input_line_content[item='" + item +"'][i='"+ this._index+"']").val();

        if ( (!(input_line_type).trim()) || (!(input_line_content).trim())) {
            var show_err = {
                source: "Бородатый программист зол.",
                error: "Заполните поля. Пустые поля недопустимы. "
            };
            Session.set('administration_error',show_err);
            return;
        }

        var replace = {
            "type"   : input_line_type,
            "content": input_line_content
        };

        updater['$set'] = {};
        updater['$set'][this._source+".$"] = replace;

        var search = {
            _id: this._parent._id
        };

        search[this._source] = {
            "type"   : this.type,
            "content": this.content
        };

        Meteor.call('UpdateArrayField', search, updater, function (error, result) {
            if (result.error) {
                // handle errors
                if (!result.error) {result.error = ""}
                var show_err = {
                    source: "Requests form. Update client field " + that._source + ". ",
                    error: JSON.stringify(result.error)
                };
                Session.set('administration_error',show_err);
            } else {
                // examine result
                $(".input_line_type[item='" + item + "'][i='" + that._index + "']").removeClass('alerted');
                $(".input_line_content[item='" + item +"'][i='"+ that._index+"']").removeClass('alerted');
                addCommentary({
                    "_log" : "Изменён элемент",
                    "field": item,
                    "line" : search,
                    "replace" : replace
                })
            }
        });
    },
    'click .button_status':function(){

        var new_status = $('#client_new_status').val();
        var comments   = $('#client_new_comments').val();
        var owner      = Meteor.users.findOne()._id;

        if ((!comments) && (!new_status)) {
            var show_err = {
                source: "Нечего обновлять, комментарий пуст, статус прежний.",
                error: "Ничего не было изменено."
            };
            Session.set('administration_error',show_err);
            return;
        }

        var add = {}

        if (comments) {
            add = {
                "owner"  : owner,
                "content": comments,
                "added"  : TimeSync.serverTime()
            }
        } else {
            var show_err = {
                source: "Нет комментариев, будет сложно вспомнить",
                error: "Напишите хоть что нибудь о новом статусе. Почему изменён?"
            };
            Session.set('administration_error',show_err);
            return;
        }

        var updater = {};

        if (new_status) {
            add['system']  = JSON.stringify({
                "_log" : "Новый статус клиента",
                "status" : new_status,
                "old_status" : this.status
            });
            updater['$set'] = {};
            updater['$set']['status']  = new_status
        }

        updater['$addToSet'] = {};
        updater['$addToSet']['commentaries'] = add;

        Clients.update(this._id,updater,function(err,newid)
        {
            if ((!err) && (newid))
            {
                $('#client_new_status').val('');
                $('#client_new_comments').val('') ;
            } else {
                if (err == undefined) {err = "Done nothing!"}
                var show_err = {
                    source: "Commentaries and status. Update client.",
                    error: err.toString()
                };
                Session.set('administration_error',show_err);
            }
        });
    },
    'click .button_pay': function() {
        var owner      = Meteor.users.findOne()._id;
        var payment   = $('#pay').val();

        if (payment) {
            add = {
                "sum"  : payment,
                "owner": owner,
                "added": TimeSync.serverTime()
            }
        } else {
            var show_err = {
                source: "Напишите сумму выплаты",
                error:  "Когда средства уже получены"
            };
            Session.set('administration_error',show_err);
            return;
        }

        var updater = {};
        updater['$addToSet'] = {};
        updater['$addToSet']['rewards'] = add;

        Clients.update(this._id,updater,function(err,newid)
        {
            if ((!err) && (newid))
            {
                $('#pay').val('');
                addCommentary({
                    "_log" : "Поступил платёж от клиента",
                    "sum"  : payment,
                    "owner": owner,
                    "added": TimeSync.serverTime()
                })
            } else {
                if (err == undefined) {err = "Done nothing!"}
                var show_err = {
                    source: "Payments. Update client.",
                    error: err.toString()
                };
                Session.set('administration_error',show_err);
            }
        });
    },
    'keydown .input_line_type, keydown .input_line_content':function() {
        var item  = event.target.getAttribute("item");
        var index = event.target.getAttribute("i");
        $(".input_line_type[item='" + item + "'][i='" + index + "']").addClass('alerted');
        $(".input_line_content[item='" + item + "'][i='" + index + "']").addClass('alerted');
    }
});

addCommentary = function(systemComment,managerComment) {
    var that = this;

    if (!systemComment) {systemComment = ""};
    if (!managerComment) {managerComment = ""};

    var client_selected = Session.get('client_selected').id;
    var owner           = Meteor.users.findOne()._id;

    var updater = {};

    updater['$addToSet'] = {};
    updater['$addToSet']['commentaries'] = {
        "added"  : TimeSync.serverTime(),
        "owner"  : owner,
        "system" : JSON.stringify(systemComment),
        "content": managerComment
    };

    Clients.update(client_selected,updater,function(err,newid)
    {
        if ((!err) && (newid))
        {

        } else {
            if (err == undefined) {err = "Done nothing!"}
            var show_err = {
                source: "Comments add error.",
                error: err.toString()
            };
            Session.set('administration_error',show_err);
        }
    });
};

