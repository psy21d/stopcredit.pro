Template.Pagination.helpers({
    pagination: function() {
        var TotalPages = Session.get('RequestsTotalPages')

        if (TotalPages == 'undefined' || TotalPages == 0){
            return false
        }
        else{
            TotalPages = Math.ceil(TotalPages / 15)
        }

        var query = Router.current().params.query;
        var SendPages = {}

        SendPages['FirstPage'] = {
            page: 1
        };
        SendPages['EndPage'] = {
            page:TotalPages
        };

        var CurrentPage = Number(query.page);
        CurrentPage = CurrentPage || 1
        SendPages['CurrentPage'] = CurrentPage

        if (TotalPages < SendPages['CurrentPage']){
            delete SendPages['EndPage']
            SendPages['CurrentPage'] = TotalPages

            return SendPages
        }

        if (TotalPages == 0) {
            SendPages['CurrentPage'] = 0

            return SendPages
        }
        if (TotalPages == 1){
            delete SendPages["FirstPage"]
            delete SendPages["EndPage"]
            SendPages['CurrentPage'] = 1
            return SendPages
        }



        if (SendPages['CurrentPage'] > 3) {
            SendPages['BackPages'] = [
                {page: SendPages['CurrentPage'] - 2},
                {page: SendPages['CurrentPage'] - 1}
            ]
        }
        else if (SendPages['CurrentPage'] > 2) {
            SendPages['BackPages'] = [
                {page: SendPages['CurrentPage'] - 1}
            ]

        }

        if (SendPages['CurrentPage'] < SendPages['EndPage'].page - 2) {
            SendPages['NextPages'] = [
                {page: SendPages['CurrentPage'] + 1},
                {page: SendPages['CurrentPage'] + 2}
            ]
        }
        else if (SendPages['CurrentPage'] < SendPages['EndPage'].page - 1) {
            SendPages['NextPages'] = [
                {page: SendPages['CurrentPage'] + 1}
            ]
        }

        if (SendPages['FirstPage'].page == SendPages['CurrentPage']) {
            delete SendPages['FirstPage']
        }

        if (SendPages['EndPage'].page == SendPages['CurrentPage']) {
            delete SendPages['EndPage']
        }


        return SendPages


    }


});


Template.Pagination.events({
    'click .goPage': function(event){
        var goPage = Number(this.page);

        var query = Router.current().params.query;

        query["page"] = goPage;

        $("body").animate({"scrollTop":0},"slow");
        Session.set('Events',"goPage");
        Router.go(Router.current().route.getName(), Router.current().params, {query:query, hash: Router.current().params.hash});

    },
    'click .go':function(event){

        var go = $(event.target).attr('data');
        var query = Router.current().params.query;
        var searchResult = Session.get('RequestsTotalPages')

        var maxPage = Math.ceil(searchResult / 15)

        var currentPage = Number(query["page"]);

        $("body").animate({"scrollTop":0},"slow");

        if ( go == 'next'){

            if (currentPage + 1 <= maxPage){
                query["page"] = currentPage + 1;
            }

        }
        else if (go == 'back'){

            if (query["page"] - 1 > 0){
                query["page"] = currentPage - 1;
            }

        }
        Session.set('Events',"goPage");
        Router.go(Router.current().route.getName(), Router.current().params, {query:query, hash: Router.current().params.hash});


    }
});