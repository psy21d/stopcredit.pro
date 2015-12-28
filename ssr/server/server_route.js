//var require = __meteor_bootstrap__.require;
if (Meteor.isServer) {

    cheerio = Meteor.npmRequire('cheerio');

    $ = cheerio.load(Assets.getText('main.html'),{
        normalizeWhitespace: false,
        xmlMode: false,
        decodeEntities: false
    });

    $('template').each(function(i, elem) {
        console.log($(this).attr('name'));
        console.log($(this).html().length);
        SSR.compileTemplate($(this).attr('name'), $(this).html());
    });

    var css = Assets.getText('17600.css');
    var css2 = Assets.getText('_core.css');

    // Blaze does not allow to render templates with DOCTYPE in it.
    // This is a trick to made it possible
    Template.Land_1.helpers({
        getDocType: function() {
            return "<!DOCTYPE html>";
        },
        getCSS: function() {
            return css + css2;
        },
        getKeyWords: function() {
            return Assets.getText('keywords.html');
        },
        getCharSet: function() {
            return "<meta charset='utf-8'>";
        }
    });

    SSR.compileTemplate('autoForm','');



    // filtering only HTTP request sent by seo via AJAX-Crawling
    // this is meteorhacks:pickers coolest feature

    var seoPicker = Picker.filter(function(req, res) {
        return /_escaped_fragment_/.test(req.url);
    });

    // route for the home page
    seoPicker.route('/', function(params, req, res) {
        var html = SSR.render('Land_1', {
            css: css
        });
        res.end(html);
    });
};