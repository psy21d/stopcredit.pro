// -- схемы без коллекций для автоформ
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
// --