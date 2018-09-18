'use strict';

var cors = require('cors');
var bodyParser = require('body-parser');

module.exports = (app) => {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
    app.use(cors());

    /*
     For cross origin issue
     Add all your custom header field names here
     */
    app.use(function(req, res, next) {

        // website you wish to allow to connect
        res.setHeader('Access-Control-Allow_Origin', '*');

        // Request method you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,access-token,token');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
}