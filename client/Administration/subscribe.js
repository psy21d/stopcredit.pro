Tracker.autorun(function () {
//    Meteor.subscribe("requests");
//    Meteor.subscribe("clients");
//    Meteor.subscribe("operators");

    Meteor.subscribe("Banks");
    Meteor.subscribe("Managers");
    Meteor.subscribe("Bank_products");
    Meteor.subscribe("Contracts");
    Meteor.subscribe("Personal_data");
    Meteor.subscribe("Document_names");
    Meteor.subscribe("Bank_fields");
});
