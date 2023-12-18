const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const rooms = [
  {
    "roomId": 1,
    "bookedStatus": false,
    "roomName": "Room A",
    "seatsAvailable": 50,
    "amenities": ["projector", "whiteboard"],
    "price_per_hr": 1000
  },
  {
    "roomId": 2,
    "bookedStatus": false,
    "roomName": "Room B",
    "seatsAvailable": 20,
    "amenities": ["teleconferencing", "coffee machine"],
    "price_per_hr": 850
  },
  {
    "roomId": 3,
    "bookedStatus": false,
    "roomName": "Room C",
    "seatsAvailable": 30,
    "amenities": ["flipchart", "computers"],
    "price_per_hr": 1200
  },
  {
    "roomId": 4,
    "bookedStatus": false,
    "roomName": "Room D",
    "seatsAvailable": 15,
    "amenities": ["TV", "conference phone"],
    "price_per_hr": 800
  },
  {
    "roomId": 5,
    "bookedStatus": false,
    "roomName": "Room E",
    "seatsAvailable": 10,
    "amenities": ["private restroom", "catering service"],
    "price_per_hr": 150
  }
];


const bookings = [
  {
    "bookingId": 1,
    "customerName": "Samantha",
    "roomName": "Conference Room A",
    "roomId": 1,
    "bookedStatus": true,
    "date": "2023-01-01",
    "startTime": "10:00",
    "endTime": "12:00"
  },
  {
    "bookingId": 2,
    "customerName": "Trisha",
    "roomId": 3,
    "bookedStatus": true,
    "roomName": "Training Room 1",
    "date": "2023-01-02",
    "startTime": "14:00",
    "endTime": "16:00"
  },
  {
    "bookingId": 3,
    "customerName": "Dhanu",
    "roomId": 2,
    "bookedStatus": true,
    "roomName": "Boardroom B",
    "date": "2023-01-03",
    "startTime": "09:30",
    "endTime": "11:30"
  },
  {
    "bookingId": 4,
    "customerName": "Sree",
    "roomId": 4,
    "bookedStatus": true,
    "roomName": "Meeting Room X",
    "date": "2023-01-04",
    "startTime": "13:00",
    "endTime": "15:00"
  },
  {
    "bookingId": 5,
    "customerName": "Vijay",
    "roomId": 5,
    "bookedStatus": true,
    "roomName": "Executive Suite",
    "date": "2023-01-05",
    "startTime": "11:00",
    "endTime": "13:00"
  }
]

//middleware
app.use(bodyParser.json());
//UI
app.get("/", (req, res) => {
  res.send(`
  <h1>Hall Booking API!</h1>
  <a href="">Booking room</a>
  <a href="#"></a>
  `);

  app.get("/rooms", () => {
    return JSON.stringify({ rooms });
  })
});

//UI page

app.get("/room", () => {
  res.send(
    `
    <a href="/rooms/booked>Room Booked</a>
    <a href="/customers/booked > Customer Booked room</a>
    <a href="/customer/:name/data"> Customer History</a>
    `
  )
})

//Create room 
app.post('/createroom', (req, res) => {
  const { roomName, seatsAvailable, amenities, price_per_hr } = req.body
  const newRoom = {
    roomId: rooms.length + 1,
    bookedStatus: false, roomName,
    seatsAvailable, amenities, price_per_hr
  };
  rooms.push(newRoom);
  res.json({ Message: "Room Created" })
})


// Book a Room
app.post("/book/:id", (req, res) => {
  let id = parseInt(req.params.id);
  if (!isNaN(id)) {
    let item = rooms.find((x) => x.roomId == id);
    if (item) {
      if (item.bookedStatus === false) {
        item.bookedStatus = true;
        res.json({ Message: "Room is now booked!" });
      } else {
        res.status(400).json({ Error: "This room is already booked." });
      }
    } else {
      res.status(400).json({ Error: "Invalid ID." });
    }
  } else {
    res.status(500).json({ Error: "Server error." });
  }
});


//chech if already booked or not
app.get("/checkBooking/:id", (req, res) => {
  let id = parseInt(req.params.id)
  const found = rooms.some((x) => x.roomId == id && x.bookedStatus === true)
  res.json(found ? { Message: `The room with the id ${id} is currently booked.` } : {
    Error: `There is no
  record of the room with the id ${id}.`
  })
});

// Get all available rooms
app.get("/available", (req, res) => {
  const availableRooms = rooms.filter((r) => r.bookedStatus === false)
  res.json(availableRooms)
})

//List all Rooms with Booked Data
app.get('/rooms/booked', (req, res) => {
  res.send(rooms.map(i => {
    return {
      ...i,
      bookedStatus: i.bookedStatus ? "Booked Successfully" : "Not Booked"
    }
  }
  ))
});

//list all customer with Booked Data
app.get('/customers/booked', (req, res) => {
 const bookedCustomer = bookings.map((booking)=>{
  const room = rooms.find((r)=>r.roomId === booking.roomId)
  return {
    customerName:booking.customerName,
    roomName:booking.roomName,
    data:booking.date,
    startTime:booking.startTime,
    endTime:booking.endTime
  }
 })
 res.json(bookedCustomer)
})

// List how many times a customer has booked the room
app.get('/customer/:name/data', (req, res) => {
  const name = req.params.name; // Corrected variable name
  const data = bookings.filter((booking) => booking.customerName === name) // Corrected variable name
    .map((booking) => {
      const room = rooms.find((q) => q.roomId === booking.roomId);
      return {
        roomName: booking.roomName,
        date: booking.date,
        startTime: booking.startTime, // Corrected variable name
        endTime: booking.endTime, // Corrected variable name
        bookedStatus: "Ok"
      }
    })
  res.json({
    name, Booking_data: data
  })
})






//start server
//server listen on port 3000

app.listen(3000, () => console.log("PORT : 3000 Hall Booking API"));
