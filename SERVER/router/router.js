const checkAuth = require('../middleware/check_auth');

module.exports = (app) => {
    const chats = require('../controller/controller.js');

    // app.get('/login', chats.login);
    app.post('/register', chats.register);

    app.post('/login', chats.login);
    //app.patch('/login/reset',chats.resetPassword);
   // app.post('/reset/:token', checkAuth, chats.resetPassword);

    app.patch('/forgotPassword/:tokenId', chats.forgotPasswordSet);
    app.post('/forgotPassword', chats.forgotPassword);
    app.get('/login/dashboard',chats.contacts);
}   