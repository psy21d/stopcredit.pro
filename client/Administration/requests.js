Tracker.autorun(function () {
//    Meteor.subscribe("requests");
//    Meteor.subscribe("clients");
//    Meteor.subscribe("operators");
    Meteor.subscribe("Managers")
});

Methods = {
    isrole:function(){
        return Meteor.users.findOne(Meteor.userId()) && (Roles.userIsInRole(Meteor.userId(), ['admin']))
    }
}

    var getRequests_default = {
        find:{
            status:"new"
        }
    };

    Session.set('getRequests',getRequests_default);

  RequestsController = AppController.extend({
        // template: 'home',

        // layoutTemplate: 'layout',
        waitOn: function () {
            return Meteor.subscribe('requests',getRequests_default );
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
            console.log('Method action');
            Session.set('Template','A_requests');
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
        },

    });

  to_find = ['new'];
  Session.set('to_find',to_find);

  Session.set('RequestsEmptyManager',false);
  /*Template.A_requests.created = function () {
  };*/

  Managers = Meteor.users.find({"roles":{'$in':["manager"]}}).fetch()
  Template.upmenu.helpers({
      isrole:function(){
          return Methods.isrole()
      }
  });
  Template.A_requests.helpers({
    requests: function () {
        var getRequests = Session.get('getRequests')

        var query = Router.current().params.query;

        if (query.status){
            if (query.status == 'empty_manager'){
                getRequests.find.manager = ""
            }
            else{
                getRequests.find.status = query.status
            }

        }

        if (query.page){
            getRequests.page = query.page
        }

        Meteor.call('totalCountRequests',getRequests.find,function(err,totalPages){
            if (!err){
                Session.set('RequestsTotalPages', totalPages)
            }
        });

        Meteor.subscribe('requests', getRequests)

        return Requests.find(getRequests.find)
    },
    manager: function(){

        if ((Meteor.users.findOne(Meteor.userId()) && (Roles.userIsInRole(Meteor.userId(), ['admin'])))) {
            return Meteor.users.findOne({"_id": this.manager}).profile.fio
        }
        else{
            return Meteor.users.findOne({"_id": Meteor.userId()}).profile.fio
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

        var managerId = this.context_request.manager

        for (var i=0; i < this.list_managers.length; i++){

            if (this.list_managers[i]._id == managerId){
                this.list_managers[i].selected = true
            }
        }

        return this.list_managers
    },
    request_selected: function() {
      return Session.get('request_selected');
    },
    client_selected: function() {
        return Session.get('client_selected');
    },
    request_is_selected: function() {
      if (Session.get('request_selected'))
      {
        return Session.get('request_selected').id == this._id;
      } else {
        return null
      }
    },
    client_is_selected: function() {
        if (Session.get('client_selected'))
        {
            return Session.get('client_selected').id == this._id;
        } else {
            return null
        }
    },
    selectedRequest: function () {
      return Requests.findOne(Session.get("request_selected").id);
    },
    findClients:function(){
      return Session.get('clients_found')
    },
    isrole:function(){

        return Methods.isrole()

    }
  });

  Template.A_requests.events({
    'click .status_requests': function(event, template) {
      var status_requests = $(event.target).val()
      var find = {
          status:status_requests
      }

      var query = {
          page:1,
          status:status_requests
      }

      Router.go(Router.current().route.getName(), Router.current().params, {query:query, hash: Router.current().params.hash});


        if (status_requests == 'empty_manager' && !Methods.isrole()){
        return false
      }
      else if (status_requests == 'empty_manager' && Methods.isrole()) {
          find = {
              manager:""
          }
      }

      Session.set('getRequests',{
           find:find
      });
    },
    'click a.request': function (event,template) {
      event.stopPropagation();
      var request_selected = {
        id : this._id,
        role : event.target.getAttribute("role")
      };

      Session.set('request_selected',request_selected);
      Session.set('to_search_client','');
    },
    'click .list_managers':function(event, template){
        event.stopPropagation();


    },
    'change .list_managers' : function(event,template){

        var ManagerId = $(event.target).val();

        if (ManagerId){
            Requests.update({"_id":this._id}, {$set:{manager: ManagerId}})
        }



    },
    'click .request-item': function (event,template) {
      event.stopPropagation();
      var request_selected = {
            id : this._id,
            role : "info"
      };

      if ((Session.get('request_selected') != null) &&
          (Session.get('request_selected').id == request_selected.id))
      {
        Session.set('request_selected',null);
      } else {
        Session.set('request_selected',request_selected);
      }
        Session.set('to_search_client','');
    },

    'click .client-item': function (event, template) {
      event.stopPropagation();
      var client_selected = {
          id : this._id,
          role : "info"
      };
      if ((Session.get('client_selected') != null) &&
          (Session.get('client_selected').id == client_selected.id))
      {
          Session.set('client_selected',null);
      } else {
          Session.set('client_selected',client_selected);
      }
    },

    'keyup .attach-request': function (event,template) {
        var to_search = event.target.value;
        Session.set('to_search_client',to_search);

        if (to_search.length < 3)
        {
            Session.set('client_selected',null);
            return null;
        }

        var find = Meteor.call('SearchClients', to_search, function(err,found){
            if (found){
                Session.set('clients_found',found)

            }
        });


        var parts = to_search.trim().split(/[ \-\:]+/);
        setTimeout(function(){
            $('.client-item').unhighlight();
            _.each(parts,function (e,n) {
                $('.client-item').highlight(e);
            });
        },1600)

    }

  });

  var Request_bad_hooks = {
    // Called when any submit operation succeeds
    before: {
        update: function(doc) {
            this.result(doc);

        }
    },
    onSuccess: function(formType, result) {
      if (Session.get('request_selected') != null)
      {
         var _rs = Session.get('request_selected');
         _rs.role = 'info';
         Session.set('request_selected',_rs);
      }
    }
  }

    var Request_new_hooks = {
    before: {
      // Replace `formType` with the form `type` attribute to which this hook applies
      update: function(doc) {
        // Potentially alter the doc
        // console.log(doc);
        var client_selected = Session.get('client_selected');
        if (client_selected) { client_selected = client_selected.id }
        if (client_selected) { client_selected = Clients.findOne(client_selected) };

        var that = this;

        if (client_selected) {

        var updater = { $addToSet:
            {
             "requests" : {
                 "id" : this.docId,
                 "attached": TimeSync.serverTime()
                },
             "status" : "Горячие"
            }
        };

        Clients.update(client_selected._id,updater,function(err,newid)
            {
                if ((!err) && (newid))
                {
                    doc.$set.manager = Meteor.users.findOne()._id;
                    Session.set('to_search_client','');
                    Router.go('a_clients');
                    that.result(doc);
                } else {
                    var show_err = {
                        source: "Requests form. Update client and attach request.",
                        error: err.toString()
                    };
                    Session.set('administration_error',show_err);
                    that.result(false);
                }
            });

        } else {

            var newclient = {
                "requests" : [{
                    "id" : this.docId,
                    "attached": TimeSync.serverTime()
                }],
                "owner" : Meteor.users.findOne()._id,
                "info" : [
                    {
                        "type" : "fio",
                        "content" : doc.$set.manager_comments
                    },
                    {
                        "type" : "name",
                        "content" : this.currentDoc.name
                    }
                ],
                "added": TimeSync.serverTime(),
                "contacts" : [{
                    "type" : "phone",
                    "content" : this.currentDoc.phone
                }],
                "status" : "Горячие"
            };

           // console.log(this);

            Clients.insert(newclient,
               function(err,newid)
               {
                    if ((!err) && (newid))
                    {
                        doc.$set.manager = Meteor.users.findOne()._id;
                        var client_selected = {
                            id : newid,
                            role : "info"
                        };
                        Session.set('client_selected',client_selected);
                        Session.set('to_search_client','');
                        Router.go('a_clients');
                        that.result(doc);
                    } else {
                        var show_err = {
                         source: "Requests form. Add client and attach request.",
                         error: err.toString()
                        };
                        Session.set('administration_error',show_err);
                        that.result(false);
                    }
               });
        }

        // Then return it or pass it to this.result()
        //return doc; (synchronous)
        //return false; (synchronous, cancel)
        //this.result(doc); (asynchronous)
        //this.result(false); (asynchronous, cancel)
      }
    },
    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {
      if (Session.get('request_selected') != null)
      {
        var _rs = Session.get('request_selected');
        _rs.role = 'info';
        Session.set('request_selected',_rs);
      }
    }
  }


  AutoForm.addHooks('request_bad', Request_bad_hooks, true);
  AutoForm.addHooks('request_later', Request_bad_hooks, true);
  AutoForm.addHooks('request_new', Request_new_hooks, true);
  //AutoForm.addHooks('Request_form_1_inland_form', Request_form_1_hooks, true);



