
/*
 * GET home page.
 */

var lataukset = 0;
var url;
var id;
var params = [];
var EdellinenID;

function urlParse (querystring) {
    // remove any preceding url and split
    querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
    var params = {}, pair, d = decodeURIComponent;
    // march and parse
    for (var i = querystring.length - 1; i >= 0; i--) {
        pair = querystring[i].split('=');
        params[d(pair[0])] = d(pair[1]);
    }
    
    return params;
};

exports.index = function (req, res) {
    
    url = res.req.url;
    id = urlParse(url);

    if (id.myParam == undefined) {
        if (EdellinenID != undefined) id.myParam = EdellinenID;
        else id.myParam = 0;
    }

    lataukset++;
    
    EdellinenID = id.myParam;

    res.render('index', { omaTieto: id.myParam.toString() });
};