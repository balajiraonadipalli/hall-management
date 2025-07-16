const Booking = require("../models/BookingModel");
const express = require("express");
const Hall = require("../models/HallModel");
const Dept = require("../models/DepartmentModel")
const BookingRouter = express.Router();
const sendBookingMail = require("../utils/mailer");


BookingRouter.post("/bookings", async (req, res) => {
  console.log(req.body.formData);
  try {
    const {
      name,
      email,
      Department,
      hallName,
      bookingDate,
      startTime,
      endTime
    } = req.body.formData;
    console.log(hallName);
    //-------------------------------------------------
    const department = await Dept.findOne({ DeptName: Department });
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const halls = await Hall.find({ department: department._id, isActive: true });

    const availableHalls = [];

    for (const hall of halls) {
      console.log(hall)
      const overlapping = await Booking.findOne({
        hall: hall._id,
        bookingDate: new Date(bookingDate),
        // status: { $in: ["pending", "approved"] },
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
      });

      if (!overlapping) {
        availableHalls.push(hall);
      }

    }

    console.log(availableHalls);
    //------------------------------------------
    const hall = await Hall.findOne({ hallName: hallName });

    console.log("hall" + hall);
    if (!hall || !hall.isActive) {
      //  failure email
      await sendBookingMail({
        to: "balajirao.nadipalli@gmail.com",
        subject: `Hall Booking Failed - ${hallName}`,
        text: `Sorry, the hall "${hallName}" is not available or inactive. Please try another.`
      });

      return res.status(400).json({ error: "Hall not found or inactive." });
    }

    const hallAvailable = availableHalls.find(h => h.hallName == hall.hallName);
    if (hallAvailable) {
      console.log("hall is avalilable");
      const booking = await Booking.create({

        name: name,
        hall: hall._id, // Use ObjectId here!
        bookingDate: bookingDate,
        startTime: startTime,
        endTime: endTime,
        status: "pending"

      });
      console.log("conformation");
      //Send success email
      await sendBookingMail({
        to: "balajirao.nadipalli@gmail.com",
        subject: `Hall Booking Confirmation - ${hall.hallName}`,
        text: `Your booking for hall "${hall.hallName}" on ${bookingDate} from ${startTime} to ${endTime} is ${booking.status}.`
      });

      res.status(201).json(booking);
    } else {
      res.status(200).json({ message: "Hall is not available" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




BookingRouter.get("/departments/name/:name/available-halls", async (req, res) => {
  const { name } = req.params;
  const { date, startTime, endTime } = req.query;

  const department = await Department.findOne({ DeptName: name });
  if (!department) {
    return res.status(404).json({ error: "Department not found" });
  }

  const halls = await Hall.find({ department: department._id, isActive: true });

  const availableHalls = [];

  for (const hall of halls) {
    const overlapping = await Booking.findOne({
      hall: hall._id,
      bookingDate: new Date(date),
      status: { $in: ["pending", "approved"] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (!overlapping) {
      availableHalls.push(hall);
    }
  }
  res.json(availableHalls);
});

BookingRouter.get("/getpendings", async (req, res) => {
  try {
    const pendingList = await Booking.find({ status: "pending" });
    if (pendingList) {
      return res.status(200).json({ pendingList })
    }
    res.status(201).json({ message: "No Pending Lists" })
  } catch (error) {
    res.status(500).json({ message: error });
  }
});


BookingRouter.patch("/bookings/:id/status", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" })
    }
    console.log(req.body.hallName);
    const hall = await Hall.findOne({ hallName: req.body.hallName });

    console.log(hall);

    if (!hall || !hall.isActive) {
      //  failure email
      await sendBookingMail({
        to: "chaitanyavarmamudunoori@gmail.com",
        subject: `Hall Booking Failed - ${req.body.hallName}`,
        text: `Sorry, the hall "${req.body.hallName}" is not available or inactive. Please try another.`
      });

      return res.status(400).json({ error: "Hall not found or inactive." });
    }

    // const booking = await Booking.create({
    //   ...req.body,
    //   hall: hall._id
    // });
    //Send success email
    booking.status = req.body.status;
    const save = await booking.save();
    await sendBookingMail({
      to: "chaitanyavarmamudunoori@gmail.com",
      subject: `Hall Booking Confirmation - ${hall.hallName}`,
      text: `Your booking for hall "${hall.hallName}" on ${booking.bookingDate} from ${booking.startTime} to ${booking.endTime} is ${save.status}.`
    });


    res.status(200).json({ message: "Status Uploaded successfully", booking })
  } catch (error) {
    res.status(500).json({ message: error })
  }
});

BookingRouter.post("/addHall", async (req, res) => {
  try {
    const { hallName, capacity, department } = req.body;
    console.log(req.body);
    const dept = await Dept.findOne({ DeptName: department });
    console.log(dept);
    const existHall = await Hall.findOne({ hallName });
    if (dept) {
      if (!existHall) {
        const newHall = await Hall.create({
          hallName,
          capacity,
          department: dept._id
        })
        if (newHall) {
          console.log(newHall);
          res.status(201).json({ message: "New Hall is Added" });
        }
      } else {
        res.status(400).json({ message: "Hall is already created" })
      }
    }else{
      res.status(400).json({message:"Department is Not there"});
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
})


BookingRouter.post("/addDept", async (req, res) => {
  try {
    const { DeptName } = req.body;
    const existDept = await Dept.findOne({ DeptName });
    if (existDept) {
      return res.status(400).json({ message: "DEpartment already created" });
    }
    const newDept = await Dept.create({
      DeptName
    })
    if (newDept) {
      res.status(200).json({ message: "Department is created", newDept });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

BookingRouter.get("/getallbookings",async(req,res)=>{
  try {
    const date = new Date();
    console.log(date);
    const todaybookings = await Booking.find({date});
    console.log(todaybookings)
    res.status(200).json({todaybookings});
  } catch (error) {
    res.status(500).json({error})
  }
})

BookingRouter.post("/getallbookings", async (req, res) => {
  try {
    const { date } = req.body; 

    const [year, month, day] = date.split("-").map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day));       // 2025-07-09T00:00:00.000Z
    const endOfDay = new Date(Date.UTC(year, month - 1, day + 1));     // 2025-07-10T00:00:00.000Z
    const bookings = await Booking.find({
      bookingDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
   

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = BookingRouter;