const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirthday: { type: Date, required: true },
  foundUsBy: { type: String, required: true }
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
    },
    description: {
      type: String,
      required: true,
      minlength: 30,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    participants: [participantSchema]
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
