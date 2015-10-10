var pwdMgr = require('./managePasswords');
var validateRequest = require("./validateRequest");




module.exports = function (server, db) {
    // unique index
    db.appUsers.createIndex({
        email: 1
    }, {
        unique: true
    })

// USER REGISTER
    server.post('/api/v1/diaspora/auth/register', function (req, res, next) {
        var user = req.params;
       // pwdMgr.cryptPassword(user.password, function (err, hash) {
            //user.password = hash;
            db.appUsers.insert(user,
                function (err, dbUser) {
                    if (err) { // duplicate key error
                        if (err.code == 11000) /* http://www.mongodb.org/about/contributors/error-codes/*/ {
                            res.writeHead(400, {
                                'Content-Type': 'application/json; charset=utf-8'
                            });
                            res.end(JSON.stringify({
                                error: err,
                                message: "A user with this email already exists"
                            }));
                        }
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json; charset=utf-8'
                        });
                        //dbUser.password = "";
                        res.end(JSON.stringify(dbUser));
                    }
                });
       // });
        return next();
    });


    server.get('/api/v1/diaspora/data/user',function(req, res, next){
        validateRequest.validate(req, res, db, function () {
            db.appUsers.findOne({
                email: req.params.token
            }, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
        });
        return next();
    });

};