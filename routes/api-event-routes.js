const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  registerOnEvent,
  getRegisteredParticipantToDay
} = require("../controllers/api-event-controller");

router.get("/api/all-events",  getAllEvents);
router.get("/api/registered-to-day",  getRegisteredParticipantToDay);
router.post("/api/register-participant", registerOnEvent);


module.exports = router;
