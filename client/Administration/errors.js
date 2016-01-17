Template.errors.events({
    'click': function () {
        Session.set('administration_error',null);
    }
});

Template.errors.helpers({
    administration_error : function() {
        return Session.get('administration_error');
    },
    callback_error : function(){
        Meteor.defer(function () {

            //  setTimeout(function(){
            //     Session.set('administration_error',null);
            //  },5000)

        });
    }
});

