var pwdMgr = require('./managePasswords');
var validateRequest = require("./validateRequest");

module.exports = function (server, db) {
    // unique index
    db.appUsers.ensureIndex({
        email: 1
    }, {
        unique: true
    })

    server.post('/api/v1/diaspora/auth/register', function (req, res, next) {
        var user = req.params;
        pwdMgr.cryptPassword(user.password, function (err, hash) {
            user.password = hash;
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
                        dbUser.password = "";
                        res.end(JSON.stringify(dbUser));
                    }
                });
        });
        return next();
    });

    server.post('/api/v1/diaspora/auth/login', function (req, res, next) {
        var user = req.params;
        if (user.email.trim().length == 0 || user.password.trim().length == 0) {
            res.writeHead(403, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                error: "Invalid Credentials"
            }));
        }
        db.appUsers.findOne({
            email: req.params.email
        }, function (err, dbUser) {
            if(!dbUser){//if the database finds no email, it will return null, but any falsey will also mean something's amiss
                res.writeHead(403, contentTypeTipo);
                res.end(JSON.stringify({
                    error: 'Invalid credentials. User not found.'
                }));
            }


            pwdMgr.comparePassword(user.password, dbUser.password, function (err, isPasswordMatch) {

                if (isPasswordMatch) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    // remove password hash before sending to the client
                    dbUser.password = "";
                    res.end(JSON.stringify(dbUser));
                } else {
                    res.writeHead(403, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify({
                        error: "Invalid User"
                    }));
                }

            });
        });
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
    })
};