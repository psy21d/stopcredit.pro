
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
    }
});
