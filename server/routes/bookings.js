var express = require('express')
var router = express.Router()

// mongojs
var mongojs = require('mongojs')
var db = mongojs('mongodb://jrhe1:123456@ds161443.mlab.com:61443/react-native-taxi', ['bookings'])


router.get('/bookings', function(req, res, next){

  db.bookings.find(function(err, bookings){
    if(err){
      res.send(err)
      return;
    }

    res.json(bookings)
  })
})


router.post('/bookings', function(req, res, next){

  var booking = req.body.data;
  var nearByDriver = req.body.data.nearByDriver;
  var io = req.app.io;

  if(!booking.userName){
    res.status(400);
    res.json({
      error: 'Bad data'
    })
    return;
  }

  db.bookings.save(booking, function(err, savedBooking){
    if(err){
      res.send(err)
      return;
    }

    res.json(savedBooking)

    if(nearByDriver.socketId){
      io.emit(nearByDriver.socketId + "driverRequest", savedBooking)
    }else{
      console.log("driver not connected")
    }


  })
})


// Driver  Update Booking done on driver side
router.put("/bookings/:id", function(req, res, next){
    var io = req.app.io;
    var booking = req.body;
    if (!booking.status){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        db.bookings.update({_id: mongojs.ObjectId(req.params.id)},{ $set: {
        	driverId: booking.driverId,
        	status: booking.status
        }}, function(err, updatedBooking){
        if (err){
            res.send(err);
        }
        if (updatedBooking){
            //Get Confirmed booking
            db.bookings.findOne({_id:  mongojs.ObjectId(req.params.id)},function(error, confirmedBooking){
                if (error){
                    res.send(error);
                }
                res.send(confirmedBooking);
                io.emit("action", {
                    type:"BOOKING_CONFIRMED",
                    payload:confirmedBooking
                });
            });
        }
    });
    }
});



module.exports = router
