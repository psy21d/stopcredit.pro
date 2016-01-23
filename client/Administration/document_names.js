if (Meteor.isClient) {
    Template.document_names.helpers({});

    Template.document_names.rendered = function () {

        var ractive_document_names = {};

        var ractive = new Ractive({
            el: "#ractive_document_names",
            template: Ract.getTemplate('document_names'),
            data: {
                document_names : ractive_document_names,
                document_templates: document_templates, //templates.js файлы для генерации документов
                document_types: document_types, //templates.js к какому типу относится ( банк, продукт, договор, личные)
                _: _
            }
        });

        ractive.update_fields = function() {
            var document_names = Document_names.find().fetch();

            _.each(document_names,function(record) {
                Meteor.call('GetUserName', record.manager,
                    function(err, response) {
                        record.manager_fio =  response;
                        record.need_edit = false;
                        ractive.update();
                    }
                );
                ractive_document_names[record._id] = record;
            });

            ractive.update();

        };

        ractive.update_fields();

        Document_names.find().observe({
            added : function(document) {
                ractive_document_names[document._id] = document;
                ractive.update();
            },
            changed: function(newDocument, oldDocument) {
                ractive_document_names[newDocument._id] = newDocument;
                ractive.update();
            },
            removed: function(oldDocument) {
                delete ractive_document_names[oldDocument._id];
                ractive.update();
            }
        });

        ractive.on('add_field',function() {
            var newid = Random.id();
            console.log(newid);
            ractive_document_names[newid] =
            {
                _id: newid,
                name : '',
                description : '',
                type : '',
                template : '',
                manager : Meteor.userId(),
                need_edit : true,
                need_insert : true,
                manager_fio : function() {
                    var fio = Meteor.user().fio;
                    if (!fio) {
                        return 'Я, Безымянный Самозванец';
                    } else {
                        return fio;
                    }
                }()
            };
            ractive.update();
        });

        ractive.on('edit_field', function(e) {
            //ractive.get(e.keypath).need_edit = true;
            e.context.need_edit = true;
            ractive.update();
        });

        ractive.on('save_field', function(e) {

            var context = JSON.parse(JSON.stringify(e.context));

            console.log(context);

            if (e.context.need_insert) {
                Document_names.insert(context ,function(err) {
                    if (err) {
                        console.log(err);
                        Session.set('administration_error',{source:'Ошибка добавления записи', error: err.toString()});
                    } else {
                        e.context.need_insert = false;
                        e.context.need_edit = false;
                    }
                    ractive.update();
                });
            } else {
                Document_names.update(context._id, { $set: context},function(err) {
                    if (err) {
                        console.log(err);
                        Session.set('administration_error',{source:'Ошибка обновления записи', error: err.toString()});
                    } else {
                        e.context.need_edit = false;
                    }
                    ractive.update();
                });
            }

        });

        ractive.on('remove_field', function(e) {
            if (confirm('Запись будет безвозвратно удалена. Вы точно уверены, что это необходимо? На основе таких записей строятся шаблоны документов и коллекции для них.')) {
                Document_names.remove({_id:e.context._id},function() {
                    if (err) {
                        console.log(err);
                        Session.set('administration_error',{source:'Ошибка удаления записи', error: err.toString()});
                    }
                    ractive.update();
                });
            }
        });


    }
}