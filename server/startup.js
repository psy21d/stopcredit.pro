Meteor.startup(function(){
    //Meteor.users.remove({});
    //Accounts.createUser({
    //    email: 'a@b.c',
    //    password: '123'
    //});
    // Здесь действует запрет, 403
    // Пользователь не создаётся
    // Ищем где вредители закопали настройку
})

Accounts.validateLoginAttempt(function(attempt){
    //Meteor.Error('Ты мудак');
    console.log(attempt);
    attempt.allowed = true;
    return  true; // true
    // true
    // Разрешено, по-русски значит
})
// Проверка на логинизацию

Accounts.validateNewUser(function (user) {
    return true;// true
    // true
});
// Проверка на создание нового

// Проверки не влияют на разрешения

// Validate username, without a specific error message.
//Accounts.validateNewUser(function (user) {
//    return user.username !== "root";
//});

//Meteor.users.insert({
//    emails: ['1@2.3'],
//    password: '123'
//});
