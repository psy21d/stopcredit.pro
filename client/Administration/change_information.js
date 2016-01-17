
if (Meteor.isClient) {
    Template.change_information.helpers({});

    Template.change_information.rendered = function () {

        var ractive_information_fields = {};

        var ractive = new Ractive({
            el: "#ractive_change_information",
            template: Ract.getTemplate('change_information'),
            data: {
                information_fields : ractive_information_fields,
                document_templates: document_templates, //templates.js файлы для генерации документов
                document_types: document_types, //templates.js к какому типу относится ( банк, продукт, договор, личные)
                _: _
            }
        });

        ractive.update_fields = function() {
            var information_fields = Information_fields.find().fetch();

            _.each(information_fields,function(record) {
                Meteor.call('GetUserName', record.manager,
                    function(err, response) {
                        record.manager_fio =  response;
                        record.need_edit = false;
                        ractive.update();
                    }
                );
                ractive_information_fields[record._id] = record;
            });

            ractive.update();

        };

        ractive.update_fields();

        Information_fields.find().observe({
            added : function(document) {
                ractive_information_fields[document._id] = document;
                ractive.update();
            },
            changed: function(newDocument, oldDocument) {
                ractive_information_fields[newDocument._id] = newDocument;
                ractive.update();
            },
            removed: function(oldDocument) {
                delete ractive_information_fields[oldDocument._id];
                ractive.update();
            }
            /*added(document) or
                addedAt(document, atIndex, before)
            A new document document entered the result set. The new document appears at position atIndex.
            It is immediately before the document whose _id is before. before will be null if the new document is at the end of the results.

                changed(newDocument, oldDocument) or
            changedAt(newDocument, oldDocument, atIndex)
            The contents of a document were previously oldDocument and are now newDocument. The position of the changed document is atIndex.

                removed(oldDocument) or
            removedAt(oldDocument, atIndex)
            The document oldDocument is no longer in the result set. It used to be at position atIndex.

                movedTo(document, fromIndex, toIndex, before)
            A document changed its position in the result set, from fromIndex to toIndex
            (which ibefore the document with id before). Its current contents is document.
            */
        });

        ractive.on('add_field',function() {
        var newid = Random.id();
        console.log(newid);
            ractive_information_fields[newid] =
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
                Information_fields.insert(context ,function(err) {
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
               Information_fields.update(context._id, { $set: context},function(err) {
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
                Information_fields.remove({_id:e.context._id},function() {
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