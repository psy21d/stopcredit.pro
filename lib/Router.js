AppController = RouteController.extend({});


Router.route('/secretpage', function(){
    if (!(Meteor.user() || Meteor.loggingIn())) {
        this.render('Login');
        //this.next();
    } else if (Meteor.user()) {
        this.render('A_requests');
        //this.next();
    }
});



Router.map(function () {
    this.route('/a_requests', {
        action:'action',
        layoutTemplate: 'admin',
        controller: 'RequestsController'
    });


    this.route('/a_clients', {
        action:'action',
        layoutTemplate: 'admin',
        controller:'ClientsController',

    });




});
//
//Router.route('/a_requests', {
//    layoutTemplate: 'admin',
//    controller: 'RequestsController'
//});
//
//
//Router.route('/a_clients', {
//    layoutTemplate: 'admin',
//    controller:'ClientsController',
//
//});



Router.route('/managers', function()
{
    if  (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        this.render('A_managers');
    }
    else{
        this.render('Land_1');
    }
});


Router.route('splash',
    {
        path: '/',
        template: 'Land_1'
    });
Router.route('adminpanel',
    {
        path: '/admin',
        template: 'Land_1'
    });
Router.route('anotherpages',
    {
        path: '/:something',
        template: 'Land_1'
    });
