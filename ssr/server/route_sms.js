Router.map(function() {
    this.route('sms_gateway', {
        path: '/_sms',
        where: 'server',
        action: function() {
            // GET, POST, PUT, DELETE
            var requestMethod = this.request.method;

            if (requestMethod != 'POST') {
                this.response.writeHead(405);
                this.response.end('Please, POST only');
                return;
            };

            var that = this;

            if (that.request.body.truth != 'please_sir') {
                this.response.writeHead(418);
                this.response.end('Ohh, something wrong...');
                return;
                // TODO: best verify & encrypt
            }

            var fields =
            {
                type: that.request.body.type, // incoming \ outgoing

                text    : that.request.body.text,
                when    : that.request.body.when,
                phone   : that.request.body.phone,
                sender  : that.request.body.sender,     // only for outgoing
                receiver : that.request.body.receiver,   // only for incoming
                source: that.request.body.source,
                simple:that.request.body.simple
                //simple: Jigurda
            }







            // Оповещение на пси








        }
    })
});
