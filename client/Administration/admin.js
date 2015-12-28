Template.admin.helpers({
    clients:function(){
        if (Session.get('Template') == 'A_clients' ){
            return true;

        }

    },

    requests:function(){

        if (Session.get('Template') == 'A_requests' ){

            return true;

        }

    }
})