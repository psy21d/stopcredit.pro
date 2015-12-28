Session.set('AddManager', false)

var datefomat = function(date){
    var today = new Date(date);

    var yr = today.getFullYear();
    var day = today.getDate();
    var month = today.getMonth()+1;
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    if(month < 10){
        month = "0"+ month;
    }
    var result = day+"."+month+"."+yr+" , "+hours+":"+minutes+":"+seconds
    return result

}

Template.A_managers.events({

    'click #AddManager': function (event,template) {
        var AddManager = Session.get('AddManager')
        if (AddManager){
            return Session.set('AddManager', false)
        }
        else{
            return Session.set('AddManager',true)
        }

    }

});

Template.A_managers.helpers({
    AddManager:function(){
        return Session.get('AddManager')
    },
    AddManager_s: function() {
        return Schema.AddManager_s;
    },
    schema_addmanager: function() {
        return Schemas.AddManager;
    },
    managers:function(){
        return Meteor.users.find({"roles":{'$in':["manager"]}})
    },
    createdAt:function(){
        return datefomat((Date.parse(this.createdAt)))
    },
    category_count:function(){
        console.log(arguments)
        console.log(this)
    }
});




var AddManager_events = {

    // Called when any submit operation succeeds
    onSuccess: function(formType, result) {

        var show_err = {
            source: "Добавлен новый менеджер "+result.manager,
            error: ""
        };
        Session.set('administration_error',show_err);
    },

    // Called when any submit operation fails
    onError: function(formType, error) {
        console.log(arguments)
    },

};


AutoForm.addHooks('AddManager_form', AddManager_events, true);



