const jwt = require('jsonwebtoken');
exports.tokenGenerator = (email, userid, callback) => {
    jwt.sign({
        email: email,
        id: userid
    }, "Private Key", {
        expiresIn: '6h'
    }, (err, response) => {
        if (err)
            callback(err);
        else {
            //console.log(response);
            callback(null, response);
        }
    })
}          

exports.tokenChecker = (token, callback) => {
    jwt.verify(token, "Private Key", (err, data) => {
        if (err) {
            callback(err);
        }
        else {
            callback(null, data)
        }
    })
}