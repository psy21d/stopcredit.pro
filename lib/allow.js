// -- разрешения доступа

Collections.Requests.allow({
    insert: function () {
        return true;
    },
    update:function(){
        var id = Meteor.userId()

        if ((Meteor.users.findOne(id) && (Roles.userIsInRole(id, ['manager'])))) {
            return true;
        }

        else if ((Meteor.users.findOne(id) && (Roles.userIsInRole(id, ['admin'])))) {
            return true;
        }
        else{
            return false
        }
    },
    remove: function () {
        return false;
    }
});

Collections.Clients.allow({
    insert: function () {

        var id = Meteor.userId()

        if ((Meteor.users.findOne(id) && (Roles.userIsInRole(id, ['manager'])))) {
            return true;
        }

        else if ((Meteor.users.findOne(id) && (Roles.userIsInRole(id, ['admin'])))) {
            return true;
        }
        else{
            return false
        }

        //! по ролям
    },
    update: function() {
        var id = Meteor.userId()

        if ((Meteor.users.findOne(id) && (Roles.userIsInRole(id, ['manager'])))) {
            return true;
        }

        else if ((Meteor.users.findOne(id) && (Roles.userIsInRole(id, ['admin'])))) {
            return true;
        }
        else{
            return false
        }
    },
    remove: function () {
        return false;
    }
});

Collections.Operators.allow({
    insert: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});

Collections.Banks.allow({
    insert: function () {
        return true;
    },
    update:function(){
        return true;
    },
    remove: function () {
        return true;
    }
});

Collections.Information_fields.allow({
    insert: function () {
        return true;
    },
    update:function(){
        return true;
    },
    remove: function () {
        return true;
    }
});

Collections.Document_names.allow({
    insert: function () {
        return true;
    },
    update:function(){
        return true;
    },
    remove: function () {
        return true;
    }
});

Collections.Personal_data.allow({
    insert: function () {
        return true;
    },
    update:function(){
        return true;
    },
    remove: function () {
        return true;
    }
});

Collections.Contracts.allow({
    insert: function () {
        return true;
    },
    update:function(){
        return true;
    },
    remove: function () {
        return true;
    }
});

Collections.Bank_products.allow({
    insert: function () {
        return true;
    },
    update:function(){
        return true;
    },
    remove: function () {
        return true;
    }
});


Collections.Banks.allow({
    insert: function () {
        return true;
    },
    update:function(){
        return true;
    },
    remove: function () {
        return true;
    }
});
