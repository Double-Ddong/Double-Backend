// var express = require('express');
// var http = require('http').Server(express); 
// var io = require('socket.io')(http); 
// var router = express.Router();

// router.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// });

// module.exports = router;


// io.on('connection', function(socket){ 
//     console.log("user connected")
//     socket.on('send_message', function(msg){ 
//         io.emit('receive_message', msg); }
//     ); 
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         });
// });


// http.listen(3000, function(){ console.log('listening on *:3000'); });

var app = require('express')(); 
var http = require('http').Server(app); 
var io = require('socket.io')(http); 

app.get('/', function(req, res){ 
    res.send("hi"); 
}); 
app.get("/chat",(req,res) =>{
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){ 
    socket.on('send_message', function(msg){ 
        io.emit('receive_message', msg); }
    ); 
});


http.listen(3000, function(){ console.log('listening on *:3000'); });