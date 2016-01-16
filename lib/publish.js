if (Meteor.isServer) {

    Meteor.publish("requests", function (params) {

        var find = {};
        var limit = 15;
        if (params.find){
            find = params.find
        }


            //   params.page
            skip = (params.page - 1) * limit;


        var parameters = {
            limit:limit,
            skip:skip,
            sort:{
                added:-1
            }
        };

        //Add role for current user
        //console.log(Meteor.users.findOne(this.userId))
        if ( (Meteor.users.findOne(this.userId)) && (Roles.userIsInRole(this.userId, ['manager'])) ) {
            find["manager"] = this.userId;

            return Requests.find(find,parameters)
        }
        else if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Requests.find(find,parameters)
        }

        else {
            this.stop();
            return false;
        }
    });

    Meteor.publish("Managers", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Meteor.users.find({"roles":{'$in':["manager"]}})
        }
    });

    Meteor.publish("clients", function (params) {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['manager'])))) {
            return Clients.find({"owner" : this.userId})
        }

        else if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Clients.find({})

        }

        this.stop();
        return false;
    });

    Meteor.publish("operators", function () {

        if (Meteor.users.findOne(this.userId))
            return Operators.find();
        else
            this.stop();
            return false;
    });


    Meteor.publish("Operators", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Operators.find({})
        }
    });

    Meteor.publish("Operators", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Operators.find({})
        }
    });

    Meteor.publish("Banks", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Banks.find({})
        }
    });

    Meteor.publish("Bank_products", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Bank_products.find({})
        }
    });

    Meteor.publish("Personal_data", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Personal_data.find({})
        }
    });

    Meteor.publish("Document_names", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Document_names.find({})
        }
    });

    Meteor.publish("Information_fields", function () {
        if ((Meteor.users.findOne(this.userId) && (Roles.userIsInRole(this.userId, ['admin'])))) {
            return Information_fields.find({})
        }
    });




}