buildRegExp = function(searchText) {
    // this is a dumb implementation
    var parts = searchText.trim().split(/[ \-\:]+/);
    return new RegExp("(" + parts.join('|') + ")", "ig");
};

Meteor.methods({
    AddManager: function (doc) {

        check(doc, Schemas.AddManager);


        var manager_id = Accounts.createUser({
            email : doc.email,
            password : doc.password,
            profile  : {
                phone:doc.phone,
                fio:doc.name

            }
        });

        Roles.addUsersToRoles(manager_id, ['manager'])

        return {
            manager:doc.name
        }

    },
    GetManagers: function () {
        return
    },
    totalCountRequests: function(query) {
        return Requests.find(query).count();
    },
    SearchClients : function(query){
        var regExp = buildRegExp(query);

        var find = Clients.find({$or:
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
        ]}).fetch();

        return find
    }
});
