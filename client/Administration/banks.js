
if (Meteor.isClient) {
    Template.banks.helpers({});

    Template.banks.rendered = function () {

    var ractive_banks = {};
    var ractive_information_fields = {};
    var ractive_document_names = {};

        var ractive = new Ractive({
            el: "#ractive_banks",
            template: Ract.getTemplate('banks'),
            data: {
                banks : ractive_banks,
                information_fields: ractive_information_fields,
                document_names: ractive_document_names,
                bank : '',
                _: _
            }
        });


        ractive.update_banks = function() {
            var banks = Banks.find().fetch();

            _.each(banks,function(record) {
                ractive_banks[record._id] = record;
            });

            ractive.update();

        };

        ractive.update_information_fields = function() {;
            var information_fields = Information_fields.find({type:"bank"}).fetch();

            _.each(information_fields,function(record) {
                ractive_information_fields[record.name] = record;
            });

            ractive.update();
        };

        ractive.update_document_names = function() {
            var document_names = Document_names.find({type:"bank"}).fetch();

            _.each(document_names,function(record) {
                ractive_document_names[record.name] = record;
            });

            ractive.update();
        };


        ractive.on("add_bank", function(e) {
           // var newid = Random.id();
            var bank =  {
                name: '...',
                information : {},
                documents : {}
            };

            ractive.set('bank',bank);
        });

        ractive.on("select_bank", function(e) {
            console.log(e);
            ractive.update();
        });

        ractive.on("update_bank", function(e) {
            console.log(e);
            ractive.update();
        });

        ractive.on("save_info", function(e) {
            console.log(e);
            console.log(ractive.get('newinfo_description'));
            console.log(ractive.get('newinfo_value'));
            ractive.update();
        });

        ractive.on("save_doc", function(e) {
            console.log(e);
            console.log(ractive.get('newdoc_description'));
            console.log(ractive.get('newdoc_link'));
            ractive.update();
        });

        ractive.update_banks();
        ractive.update_information_fields();
        ractive.update_document_names();
    }

}
