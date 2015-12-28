Router.map(function() {
    this.route('request_gateway', {
        path: '/_request',
        where: 'server',
        action: function() {
            // GET, POST, PUT, DELETE
            var requestMethod = this.request.method;

            if (requestMethod != 'POST') {
                this.response.writeHead(405);
                this.response.end('Please, POST only');
                return;
            }
            ;

            try {
                var body = JSON.parse(this.request.body.form);
            }
            catch (e) {
                this.response.writeHead(405);
                this.response.end('ERROR JSON PARSE!');
                return
            }

            if (body.truth != 'please_sir') {
                this.response.writeHead(418);
                this.response.end('Ohh, something wrong...');
                return;
                // TODO: best verify & encrypt
            }

            var fields = {
                sender: 'required',
                type:'required'
            }

            for (var required in fields){
                if (!body[required]){
                    this.response.writeHead(418);
                    this.response.end('Undefined required fields ' + required);
                    return
                }
            }

            var save = {}

            for (var i in body){
                if (i == 'sender'){
                    save['phone'] = body[i]
                }
                else if (i == 'text'){
                    save['comments'] = body[i]
                }
                else if (i == 'type'){
                    save['source'] = body[i]
                    save["name"] = body[i]
                }
            }
            save["added"] = new Date().getTime()

            try {
                Requests.insert(save)
                response_answer = {
                    status:true
                }
                this.response.end(JSON.stringify(response_answer))

            } catch (err) {
                console.log(err)
                response_answer = {
                    status:false,
                    error:err
                }

                this.response.end(JSON.stringify(response_answer))

            }

        }
    })
});
