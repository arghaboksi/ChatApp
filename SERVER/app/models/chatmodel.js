var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    messages: [{message:{type:String}}]
});
module.exports = mongoose.model('chat', userSchema);