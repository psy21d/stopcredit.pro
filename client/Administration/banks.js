
if (Meteor.isClient) {

    Template.banks.helpers({});

    Template.banks.rendered = function () {

    var ractive_banks = {};
    var ractive_products = {};
    var ractive_information_fields = {};
    var ractive_document_names = {};

        var ractive = new Ractive({
            el: "#ractive_banks",
            template: Ract.getTemplate('banks'),
            data: {
                banks : ractive_banks,
                products: ractive_products,
                information_fields: ractive_information_fields,
                document_names: ractive_document_names,
                bank : '',
                product: '',
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

        ractive.update_products = function() {
            var products = Bank_products.find().fetch();

            _.each(products,function(record) {
                ractive_products[record._id] = record;
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
            var newid = Random.id();
            var bank = {
                id: newid,
                name: e.context.newbank_name,
                information : {},
                documents : {}
            };

            Banks.insert(bank,function(err){
                if (err) {
                    console.log(err);
                    Session.set('administration_error',{source:'Ошибка добавления записи', error: err.toString()});
                } else {
                    ractive.set('bank',newid);
                }
            });

        });

        ractive.on("select_bank", function(e) {
            console.log(e);
            if (e.context.banks[e.context.bank]) {
                e.context.newbank_name = e.context.banks[e.context.bank].name;
            } else {
                e.context.newbank_name = "Название банка";
            }
            ractive.update();
        });

        ractive.on("update_bank", function(e) {
            console.log(e);
            ractive.update();
        });

        ractive.on("save_info", function(e) {

            var newinfo_name = e.context.newinfo_name;
            if (newinfo_name == '') { return };

            var newinfo_description = e.context.newinfo_description;
            var newinfo_value = e.context.newinfo_value;

            var set = {"$set":  {} };
            set["$set"]["information." + newinfo_name] = {};
            set["$set"]["information." + newinfo_name].value = newinfo_description;
            set["$set"]["information." + newinfo_name].description = newinfo_value;

                Banks.update ( e.context.bank, set, function(err) {
                    if (err) {
                        console.log(err);
                        Session.set('administration_error',{source:'Ошибка добавления записи', error: err.toString()});
                    }
                });

            ractive.update();
        });

        ractive.on("save_doc", function(e) {

            var newdoc_name = e.context.newdoc_name;
            if (newdoc_name == '') { return };

            var newdoc_description = e.context.newdoc_description;
            var newdoc_link = e.context.newdoc_link;

            var set = {"$set":  {} };
            set["$set"]["documents." + newdoc_name] = {};
            set["$set"]["documents." + newdoc_name].description = newdoc_description;
            set["$set"]["documents." + newdoc_name].link = newdoc_link;

            Banks.update ( e.context.bank, set, function(err) {
                if (err) {
                    console.log(err);
                    Session.set('administration_error',{source:'Ошибка добавления записи', error: err.toString()});
                }
            });

            ractive.update();
        });

        ractive.on("add_product", function(e) {

            var newproduct_name = e.context.newproduct_name;
            var bank_id = ractive.get('bank');
            var newid = Random.id();

            console.log(e);
            return;


            if (newproduct_name == '') {
                Session.set('administration_error',{source:'Ошибка: пустое имя нового продукта'});
                return
            };

            Bank_products.insert ( newid, {
                bank_id: bank_id,
                name: newproduct_name,
                product: [{
                }]
            }, function(err) {
                if (err) {
                    console.log(err);
                    Session.set('administration_error',{source:'Ошибка добавления записи', error: err.toString()});
                } else {
                    ractive.set('product',newid);
                }
            });

            ractive.update();

        });

        ractive.update_banks();
        ractive.update_products();
        ractive.update_information_fields();
        ractive.update_document_names();

        Banks.find().observe({
            added : function(document) {
                ractive.set('bank',document._id);
                ractive_banks[document._id] = document;
                ractive.update();
            },
            changed: function(newDocument, oldDocument) {
                ractive_banks[newDocument._id] = newDocument;
                ractive.update();
            },
            removed: function(oldDocument) {
                delete  ractive_banks[oldDocument._id];
                ractive.set('bank','');
                ractive.update();
            }
        });

        Information_fields.find().observe({
            added : function(document) {
                ractive.update_information_fields();
            },
            changed: function(newDocument, oldDocument) {
                ractive.update_information_fields();
            },
            removed: function(oldDocument) {
                ractive.update_information_fields();
            }
        });

        Document_names.find().observe({
            added : function(document) {
                ractive.update_document_names();
            },
            changed: function(newDocument, oldDocument) {
                ractive.update_document_names();
            },
            removed: function(oldDocument) {
                ractive.update_document_names();
            }
        });

        Bank_products.find().observe({
            added : function(document) {
                ractive.update_products();
            },
            changed: function(newDocument, oldDocument) {
                ractive.update_products();
            },
            removed: function(oldDocument) {
                ractive.update_products();
            }
        });

    }

}
