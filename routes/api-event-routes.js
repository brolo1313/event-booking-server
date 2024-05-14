const express = require("express");
const router = express.Router();

const {
  getAllEvents,
} = require("../controllers/api-event-controller");

router.get("/api/all-events",  getAllEvents);



module.exports = router;
