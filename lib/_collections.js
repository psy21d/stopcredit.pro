Schemas = {};
Collections = {};

Collections.Requests = Requests = new Mongo.Collection("requests");
Collections.Clients  = Clients = new Mongo.Collection("clients");
//Managers = new Mongo.Collection("managers");
Collections.Operators = Operators = new Mongo.Collection("operators");
//Users = new Mongo.Collection("users");

Collections.Banks = Banks = new Mongo.Collection("banks");
Collections.Bank_products = Bank_products = new Mongo.Collection("bank_products");

Collections.Contracts = Contracts = new Mongo.Collection("contracts");

Collections.Personal_data = Personal_data = new Mongo.Collection("personal_data");
Collections.Document_names = Document_names = new Mongo.Collection("document_names");
Collections.Information_fields = Information_fields = new Mongo.Collection("information_fields");


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
});

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
    personal_data: {
        type: [Object],
        label : "Client personal data"
    },
    "personal_data.$.field_name": {
        type: String,
        label : "Client personal data field name"
    },
    "personal_data.$.content": {
        type: String,
        label : "Client personal data content"
    },
    documents: {
        type: [Object],
        label : "Client personal data"
    },
    "documents.$.field_name": {
        type: String,
        label : "Client document field name"
    },
    "documents.$.added": {
        type: Date,
        label : "Client document add date"
    },
    "documents.$.link": {
        type: String,
        label : "Client document link to file"
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


Schemas.Banks = new SimpleSchema({
    name: {
        type: String,
        label: "Bank name"
    },
    information: {
        type: Object,
        label: "Bank information fields",
        //Здесь некоторые поля будут подставлены из коллекции Bank_fields
        //По необходимости, при добавлении
        //Параграфы для шаблонов, информация о банке
        optional: true,
        blackbox: true
    },
    documents: {
        type: Object,
        label: "Bank information fields",
        //Здесь некоторые поля будут подставлены из коллекции Bank_fields
        //По необходимости, при добавлении
        optional: true,
        blackbox: true
    }
});


Schemas.Bank_products = new SimpleSchema({
    "bank_id": {
        type: String,
        label: "Bank id must be not null"
    },
    "name": {
        type: String,
        label: "Product name"
    },
    product: {
        type: [Object],
        label: "Bank product",
        optional: true
    },
        "product.start": {
            type: Date,
            label: "Product start date"
        },
        "product.end": {
            type: Date,
            label: "Product end date"
        },
        "product.$.conditions": {
            type: Date,
            label: "Product conditions (text paragraph for templates)"
        },
    information: {
        type: Object,
        label: "Product information fields",
        //Здесь некоторые поля будут подставлены из коллекции Information_fields
        //По необходимости, при добавлении
        //Параграфы для шаблонов, информация о банке
        optional: true,
        blackbox: true
    },
    documents: {
        type: Object,
        label: "Documents fields",
        //Здесь некоторые поля будут подставлены из коллекции Document_names
        //По необходимости, при добавлении
        optional: true,
        blackbox: true
    }
});

Schemas.Contracts = new SimpleSchema({
//Заключённые договора с банками
    client_id : {
        type: String,
        label: "Need client ID"
    },
    //id банка, id типа тарифного плана
    //{{field_name}}   название   контент (поля)
    //{{document_name}}   Название   Документ (содержимое)
    information: {
        type: Object,
            label: "Information for templates",
            //Здесь некоторые поля будут подставлены из коллекции Information_fields
            //По необходимости, при добавлении
            //Параграфы для шаблонов, например
            optional: true,
            blackbox: true
    },
    documents: {
        type: Object,
            label: "Documents",
            //Здесь некоторые поля будут подставлены из коллекции Document_names
            //По необходимости, при добавлении
            optional: true,
            blackbox: true
    }
});

Schemas.Personal_data = new SimpleSchema({
    field_name: {
        type: String,
        label: "Field name for Client use"
    },
    field_description: {
        type: String,
        label: "Full russian document description"
    },
    manager: {
        type: String,
        label: "Manager who add this field"
    }
});

Schemas.Document_names = new SimpleSchema({
    name: {
        type: String,
        label: "Document name for Collections use"
    },
    description: {
        type: String,
        label: "Full russian document description"
    },
    manager: {
        type: String,
        label: "Manager who add this field"
    }
});

Schemas.Information_fields = new SimpleSchema({
    name: {
        type: String,
        label: "Field name for Collections (Название)"
    },
    description: {
        type: String,
        label: "Full russian description (Описание)"
    },
    "type": {
        type: String,
        label: "Type for aggregation (bank, product, contract, etc.) (Тип)"
        //Перечислены в файле templates.js
    },
    "template": {
        type: String,
        label: "Template name for use into (Шаблон)"
    },
    manager: {
        type: String,
        label: "Manager who add this field (Менеджер)"
    }
});

Requests.attachSchema(Schemas.Requests);
Clients.attachSchema(Schemas.Clients);
Operators.attachSchema(Schemas.Operators);
Banks.attachSchema(Schemas.Banks);
Bank_products.attachSchema(Schemas.Bank_products);
Contracts.attachSchema(Schemas.Contracts);
Personal_data.attachSchema(Schemas.Personal_data);
Document_names.attachSchema(Schemas.Document_names);
Information_fields.attachSchema(Schemas.Information_fields);