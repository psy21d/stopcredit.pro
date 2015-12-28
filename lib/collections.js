Schemas = {};
Collections = {};

Collections.Requests = Requests = new Mongo.Collection("requests");
Collections.Clients  = Clients = new Mongo.Collection("clients");
//Managers = new Mongo.Collection("managers");
Collections.Operators = Operators = new Mongo.Collection("operators");
//Users = new Mongo.Collection("users");

Schemas.Requests = new SimpleSchema({
    name:{
        type: String,
        label: "Client name from input form",
        max: 200
    },
    phone:{
        type: String,
        label: "Client phone from input form",
        max: 40
    },
    comments:{
        type: String,
        label: "Client commentaries from input form",
        optional: true
    },
    manager_comments:{
        type: String,
        label: "Manager commentaries",
        defaultValue: ""
    },
    manager:{
        type: String,
        label: "Manager ID",
        defaultValue: ""
    },
    status:{
        type: String,
        label: "Status",
        defaultValue: "new"
    },
    added:{
        type: Number,
        label: "Date when request add",
        optional: true
    },
    ip_address:{
        type: String,
        label: "Ip from request add",
        defaultValue: ""
    },
    source:{
        type:String,
        label:"Request source",
        defaultValue:"unknown"
    }
});

Schemas.Sms = new SimpleSchema({
    incoming : {
        type: [Object],
        label: "SMS which we send to user",
        optional: true
    },
    "incoming.$.text" : {
        type: String,
        optional: true
    },
    "incoming.$.when" : {
        type: Number,
        optional: true
    },
    "incoming.$.phone" : {
        type: String,
        label: "User phone number which to send",
        optional: true
    },
    "incoming.$.receiver" : {
        type: String,
        label: "Our phone number which to receive",
        optional: true
    },
    outgoing : {
        type: [Object],
        label: "SMS which we send to user",
        optional: true
    },
    "outgoing.$.text" : {
        type: String,
        optional: true
    },
    "outgoing.$.when" : {
        type: Number,
        optional: true
    },
    "outgoing.$.phone" : {
        type: String,
        label: "User phone number which to receive our message",
        optional: true
    },
    "outgoing.$.sender" : {
        type: String,
        label: "Our phone number which to send",
        optional: true
    }
})

Schemas.Clients = new SimpleSchema({
    requests: {
        type: [Object],
        label: "Attached requests from input forms"
    },
        "requests.$.id":{
            type: String
        },
        "requests.$.attached":{
            type: Number,
            label: "Date when request attached to Client"
        },
    added:{
        type: Number,
        label: "Date when client add"
    },
    owner:{
        type: String,
        label: "Owner (manager) id"
    },
    info: {
        type: [Object],
        label : "Client information"
    },
    "info.$.type": {
        type: String,
        label: "Information type"
    },
    "info.$.content": {
        type: String,
        label: "Information content"
    },
    contacts: {
        type: [Object],
        label : "Client Contacts",
        optional:true
    },
    "contacts.$.type": {
        type: String,
        label: "Method how to contact with"
    },
    "contacts.$.content": {
        type: String,
        label: "Method how to contact with"
    },
    commentaries:{
        type: [Object],
        label: "Process commentaries",
        optional:true
    },
        "commentaries.$.owner": {
            type: String,
            label: "Owner (manager) id"
        },
        "commentaries.$.content": {
            type: String,
            label: "Managers wraitakaraita",
            optional:true
        },
        "commentaries.$.system": {
            type: String,
            label: "System status comment",
            optional:true
        },
        "commentaries.$.added": {
            type: Number,
            label: "Date when commentary add"
        },
    status:{
        type: String,
        label: "Client problem status",
        optional:true
    },
    rewards: {
        type: [Object],
        label: "Reward from client",
        optional:true
    },
        "rewards.$.owner": {
            type: String,
            label: "Owner (manager) id"
        },
        "rewards.$.sum": {
            type: String,
            label: "Reward sum from client"
        },
        "rewards.$.added": {
            type: Number,
            label: "Reward date from client"
        },
        "rewards.$.out_profit": {
            type: String,
            label: "Profit to us",
            optional:true
        },
        "rewards.$.out_profit_date": {
            type: Number,
            label: "Profit payd date to us",
            optional:true
        },
    sms: {
        type: [String],
        label: "All SMS chats for this client",
        optional: true
    }
});


Schemas.AddManager = new SimpleSchema({
    phone:{
        type:String,
        label:"Телефон"
    },
    email:{
        type:String,
        label:"email"
    },
    name:{
        type:String,
        label:"ФИО"
    },
    password:{
        type:String,
        label:"Пароль"
    }

})

Schemas.Operators = new SimpleSchema({
    start: {
        type: Number,
        label: "начало диапазона номеров"
    },
    end: {
        type: Number,
        label: "конец диапазона номеров"
    },
    operator: {
        type: String,
        label: "название оператора"
    },
    region: {
        type: String,
        label: "регион страны"
    }
});

Requests.attachSchema(Schemas.Requests);
Clients.attachSchema(Schemas.Clients);
Operators.attachSchema(Schemas.Operators);


Requests.allow({
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

Clients.allow({
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

Operators.allow({
    insert: function () {
        return false;
    },
    remove: function () {
        return false;
    }
});