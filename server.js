const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const validation = require('express-validator');
const mongoose = require('mongoose');
require('dotenv').config();
const socket = require('socket.io');
const chat = require('../ChatApp/SERVER/app/models/chatmodel');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(validation());
app.use(express.static(__dirname + "/CLIENT"));

//const dbconfig = require('./config/database.config.js');

mongoose.connect('mongodb://127.0.0.1:27017/chatApp', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection successful to database!');
}).catch(err => {
    console.log('Error Connecting to database', err);
    process.exit();
});
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');      //Instead of * request may be Origin,Content-Type etc. 

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})
require('./SERVER/router/router')(app);

var server = app.listen(8080, () => {
    console.log('Go to port 8080');
});

var io = socket(server);
io.on('connection', function (socket) {
    console.log('socket connection', socket.id);

    socket.on('click', function (data) {
        console.log(data.sender, data.receiver);
        chat.findOne({
            $or:
                [{ sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }]
        }).then(users => {
            socket.emit('click', users.messages);
            // console.log(users.messages);
        }).catch(err =>
            socket.emit('click', [{ message: 'No Conversations Yet. Type to Begin Conversation.' }]));
    })  

    socket.on('input', function (info) {
        let sender = info.sender;
        let receiver = info.receiver;
        let message = info.message;
        console.log(info);
        // var obj = new chat({
        //     sender: sender,
        //     receiver: receiver,
        //     messages: [{ message: message }]
        // });
        // obj.save();   
        chat.findOneAndUpdate({
            $or:
                [{ sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }]
        },
            {
                $push: {
                    messages: { message: message }
                }
            },{new:true}).then(chats => {
                if (!chats) {
                    console.log("here")
                    var obj = new chat({
                        sender: sender,
                        receiver: receiver,
                        messages: [{ message: message }]
                    });
                    obj.save().then(objects => io.sockets.emit('output', objects));
                }
                else{   
                    console.log("else block")
                    console.log(chats.messages)
                    io.sockets.emit('output', chats);
                }
            }).catch(err => {
                console.log(err);

            })

    //     chat.findOne({
    //         $or:
    //             [{ sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }]
    //     }).then(users => {
    //         io.sockets.emit('output', users.messages);
    //     }).catch(err =>
    //         console.log(err));
    // });
        })
})
    //socket.emit('output', info.message);
