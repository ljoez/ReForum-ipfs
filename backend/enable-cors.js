module.exports = function(app) {

    var methodOverride = require('method-override')
    app.use(methodOverride());
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }
    };
    app.use(allowCrossDomain);
    // Built upon: http://cuppster.com/2012/04/10/cors-middleware-for-node-js-and-express/#sthash.WdJmNaRA.dpuf

};