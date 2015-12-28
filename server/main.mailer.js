process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Необходимо для пофиксинга самоподписанного сертификата сервера.
// Теперь принимает любой.

Metamailer = (function(){

    var nodemailer = Meteor.npmRequire('nodemailer');
    var EventEmitter = Meteor.npmRequire('events').EventEmitter;
    var util = Meteor.npmRequire('util');

    var api = {};

    var transporter = nodemailer.createTransport({
        rejectUnauthorized: false,
        host: 'stopcredit.pro',
        port: 25,
        auth: {
            user: 'reminder@stopcredit.pro',
            pass: 'RPST(Wa)T_JuiL-'
        }
    });

    api.sendmail = function(mailOptions,callback) {
        if (callback == undefined) {
            callback = function() {}
        }
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                callback(error);
            } else {
                console.log(info);
                callback(null,info);
            }
        })
    };

    return api;
}());