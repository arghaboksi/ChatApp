const user = require('../app/models/usermodel.js');
const Userservices = require('../services/userservices');
const tokenService = require('../middleware/token');

exports.register = (req, res) => {
    req.checkBody('email').isEmail();
    req.checkBody('password1').isLength({ min: 6 });
    req.checkBody('password2').isLength({ min: 6 });
    const { password1, password2 } = req.body;
    if (password1 !== password2)
        res.json({ success: false, msg: 'Passwords do not match' });
    else {
        req.getValidationResult().then(err => {
            if (!err.isEmpty())
                res.json({ status: 400, msg: 'Enter Email/Password in correct format' });
            else {
                Userservices.registerUser(req.body, (err, response) => {
                    if (err)
                        res.json({ status: 500, errors: err });
                    else
                        res.json({ success: true, msg: 'Successfully Registered!' });
                })
            }
        })
    }
}
exports.login = (req, res) => {
    req.checkBody('email').isEmail();
    req.checkBody('password').isLength({ min: 6 });
    req.getValidationResult().then(err => {
        if (!err.isEmpty())
            res.json({ status: 400, msg: 'Enter Email/Password in correct format' });
        else {
            user.find({ email: req.body.email })
                .then(users => {
                    if (users.length < 1) {
                        res.json({ status: 401, msg: 'Auth Failed' });
                    }
                    else {
                        Userservices.loginUser(req.body, users, (err, response) => {
                            if (err)
                                res.json({ status: 501, msg: 'Some Error Occured' });
                            else {
                                if (response == 401)
                                    res.json({ status: 401, msg: 'Auth Failed' });
                                else {
                                    res.header('Authorization', response);
                                    res.json({ status: 200, msg: 'You Are Logged In', email:users[0].email });
                                }
                            }
                        })
                    }
                })
                .catch(err => {
                    res.json({ status: 500, msg: 'Some Error Occured' });
                })
        }
    })
}
// exports.resetPassword = (req, res) => {
//     const token = req.header('Authorization');
//     if (!token)
//         return res.json({ status: 401, msg: 'Auth Failed' })
//     Userservices.resetUser(token, req.body, (err, data) => {
//         if (err) {
//             res.json({ status: 500, msg: err.msg });
//         }
//         else
//             res.json(data);
//     })

// }
exports.forgotPassword = (req, res) => {
    req.checkBody('email').isEmail();
    req.getValidationResult().then(err => {
        if (!err.isEmpty()) {
            res.json({ status: 400, msg: 'Enter Email in correct format' });
        }
        else {
            console.log('ok');
            Userservices.forgotPasswordUser(req.body, (err, data) => {
                if (err) {
                    res.json(err);
                }
                else
                    res.json(data);
            })
        }
    })
}
exports.forgotPasswordSet = (req, res) => {

    const token = req.header('Authorization');
    if (!token)
        return res.json({ status: 401, msg: 'Auth Failed' })
    else {
        tokenService.tokenChecker(token, (err, data) => {
            if (err)
                res.json({ status: 401, msg: 'Access Denied' })
            else {
                req.checkBody("newPassword").isLength({ min: 6 });
                req.getValidationResult().then(err => {
                    if (!err.isEmpty())
                        res.json({ status: 401, msg: 'Password must be atleast 6 characters' });
                    else {
                        Userservices.forgotPasswordSet(req.body, data, (err, result) => {
                            if (err) {
                                res.json(err);
                            }
                            else
                                res.json(result);
                        })
                    }
                })
            }
        })
    }
}
exports.contacts = (req, res) => {
    user.find({},function (err, result) {
        if (err)
            res.json({ status: 500, err: err });
        else {
            res.json({ status: 200, users: result });
        }
    })
}
