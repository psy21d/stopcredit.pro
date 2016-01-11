
if (Meteor.isClient) {
    Template.change_information.helpers({});

    information_fields = {};

    Template.change_information.rendered = function () {

        Session.set('information_fields',Information_fields.find().fetch());
        information_fields = Session.get('information_fields');

        information_fields.push({manager:'WdkCypeFwDG2AhGoN'});
        information_fields.push({manager:'Z5ACfCWyMp6dnNy32'});
        information_fields.push({manager:'s3kCuKatgkPEKMMPH'});
        information_fields.push({manager:'Fwm7n7v8L3D3GFqht'});
        information_fields.push({manager:'uqzvEAHRmDhmaZkPm'});

        var ractive = new Ractive({
            el: "#ractive_change_information",
            template: Ract.getTemplate('change_information'),
            data: {
                information_fields : information_fields,
                _: _
            }
        });

        _.each(information_fields,function(record) {
            console.log(record);
            Meteor.call('GetUserName', record.manager,
                function(err, response) {
                    record.manager_fio =  response;
                    ractive.update();
                }
            );
        });

        ractive.on('add_field',function() {
            ractive.push('information_fields',{
                name : '',
                description : '',
                type : '',
                template : '',
                manager : Meteor.userId()
            });


        });
    }
}