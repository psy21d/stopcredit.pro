show_systems_commentaries = false;

if (Meteor.isClient) {
    // counter starts at 0
    // Session.setDefault('counter', 0);

    Blaze._allowJavascriptUrls();

    Template.registerHelper("Collections", Collections);
    Template.registerHelper("Schemas", Schemas);

    Template.Request_form_1.helpers({
        counter: function () {
            return Session.get('counter');
        }
    });

    Template.Request_form_1.events({
        'click .close': function () {
            // increment the counter when button is clicked
            jQuery('.Request_form_1').fadeOut(600);
            jQuery('.modal_overlay').fadeOut(600);
        }
    });

    Template.Request_form_1_thanks.events({
        'click .close': function () {
            // increment the counter when button is clicked
            jQuery('.Request_form_1_thanks').fadeOut(600);
            jQuery('.modal_overlay').fadeOut(600);
        }
    });

    Template.Confidential.events({
        'click .close': function () {
            // increment the counter when button is clicked
            jQuery('.policy_window').fadeOut(600);
            jQuery('.modal_overlay').fadeOut(600);
        }
    });

    Template.Land_1.events({
        'click .btn': function () {
            jQuery('.Request_form_1').fadeIn(600);
            jQuery('.modal_overlay').fadeIn(600);
        },
        'click .policy' : function () {
            jQuery('.policy_window').fadeIn(600);
            jQuery('.modal_overlay').fadeIn(600);
        }
    });

    var Request_form_1_hooks = {
        before: {
            insert: function(doc) {
                // Potentially alter the doc
                doc.added = TimeSync.serverTime();
                doc.ip_address = Session.get('UserIp');
                doc.source = location.origin;

                return doc;
            }
        },
        // Called when any submit operation succeeds
        onSuccess: function(formType, result) {
            jQuery('.Request_form_1_thanks').fadeIn(600);
            jQuery('.Request_form_1').fadeOut(600);
            jQuery('.modal_overlay').fadeOut(600);
        }
    }

    AutoForm.addHooks('Request_form_1_form', Request_form_1_hooks, true);
    AutoForm.addHooks('Request_form_1_inland_form', Request_form_1_hooks, true);


}

if (Meteor.isServer) {

    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.methods({
        UserIp: function () {
           // if (Meteor.connection.clientAddress) {
           //     return Meteor.connection.clientAddress;
           // } else {
                return "unknown";
           // }
        },
        UpdateArrayField: function(finder, updater) {

            return Meteor.sync(function(done) {
                Clients.update(finder,updater,
                function(err,newid)
                {
                    if ((!err) && (newid))
                    {
                        done(null,"Updated Ok")
                    } else {
                        console.log(err.sanitizedError);
                    }
                })
            })
        }
    });
}

if (Meteor.isClient) {
    Meteor.call('UserIp',function (error, result) {
        if (error) {
            // handle error
        } else {
            // examine result
            Session.set('UserIp',result);
        }
    });
}




