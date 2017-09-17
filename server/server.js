var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var bookings = require('./routes/bookings')
var driverLocation = require("./routes/driverLocation")

var app = express()

var port = 3000

var socket_io = require('socket.io')
var io = socket_io();




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', index)
app.use('/api', bookings)
app.use("/api", driverLocation);

io.listen(app.listen(port, function(){
  console.log('Now listening on ' + port);
}))

app.io = io.on("connection", function(socket){
  console.log('socket connected: ' + socket.id);
})
