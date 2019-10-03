const user = require('../app/models/usermodel.js');
const bcrypt = require('bcryptjs');
const createToken = require('../middleware/token');
const toSendMail = require('../middleware/mail');

exports.registerUser = (body, callback) => {
    var error1 = [];
    user.findOne({ email: body.email }).then(i => {
        if (i) {
            error1.push({ msg: 'Email already exists' });
            callback(error1);
        }
        else {
            var obj = new user({
                name: body.name,
                email: body.email,
                password: body.password1
            });
            console.log(obj);
            user.createUser(obj, function (err, i) {
                if (err) callback(err);
                callback(null, obj)
            })
            obj.save()
                .catch(err => {
                    console.log("Data Not Found", err);
                });
        }
    })

}
exports.loginUser = (body, users, callback) => {
    bcrypt.compare(body.password, users[0].password, (err, result) => {
        if (err)
            callback(err);
        if (result) {
            createToken.tokenGenerator(users[0].email, users[0]._id, (err, response) => {
                if (response) {
                    callback(null, response);
                }
                if (err) {
                    callback(err);
                }
            })
        }
        else {
            callback(null, 401);
        }

    })
}
/*exports.resetUser = (token, body, callback) => {
    createToken.tokenChecker(token, (err, response) => {
        if (err) {
            error = {
                msg: "Authentication Failed",
                status: 403
            }
            callback(error);
        }
        else {
            bcrypt.hash(body.newPassword, 10, (err, hash) => {
                if (err) {
                    error = {
                        msg: "Cannot generate password",
                        status: 500
                    }
                    callback(error);
                }
                else {
                    user.updateOne({ email: response.email },
                        { $set: { password: hash } })
                        .then(result => {
                            //console.log(result);
                            success = {
                                message: "Updated",
                                status: 200
                            }
                            callback(null, success);
                        })
                        .catch(err => {
                            error = {
                                message: "Update failed",
                                status: 500
                            }
                            callback(error);
                        })
                }

            })
        }
    })
}*/
exports.forgotPasswordUser = (body, callback) => {
    user.find({ email: body.email })
        .then(users => {
            if (users.length < 1) {
                error = {
                    message: "Invalid User",
                    status: 400
                }
                callback(error);
            }
            createToken.tokenGenerator(users[0].email, users[0]._id, (err, response) => {
                if (response) {
                    success = {
                        msg: "Link for Password Change has been Sent!",
                        status: 200
                    }
                    let obj = {
                        url: 'http://localhost:8080/#!/forgotPassword/' + response
                    }
                    toSendMail.nodemail(obj, users[0].email);
                    callback(null, success);
                }
                else
                    callback(err);
            })
        })
        .catch(err => {
            callback(err);
        })
}
exports.forgotPasswordSet = (body, data, callback) => {
    bcrypt.hash(body.newPassword, 10, (err, hash) => {
        if (err) {
            error = {
                msg: "Cannot generate password",
                status: 500
            }
            callback(error);
        }
        else {
            user.updateOne({ email: data.email },
                { $set: { password: hash } })
                .then(result => {
                    //console.log(result);
                    success = {
                        msg: "Password Updated",     
                        status: 200
                    }
                    callback(null, success);
                })
                .catch(err => {
                    error = {
                        msg: "Update failed",
                        status: 500
                    }
                    callback(error);
                })
            }

    })
}
