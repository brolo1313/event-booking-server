const Event = require("../models/event");
const { AppError } = require("../helpers/errors");
const { findById } = require("../helpers/default-db-actions");
const Result = require("../helpers/result");

const getAllEvents = async (req, res, next) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1; // Start page numbers at 1
    const limit = parseInt(req.query.limit) || 4;
    const result = {};
    const totalEvents = await Event.countDocuments().exec();

    const totalPages = Math.ceil(totalEvents / limit);
    // Calculate the start index
    let startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    result.totalEvents = totalEvents;
    result.totalPages = totalPages;

    // Parse sorting parameters
    let sortQuery = {};
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder || "asc";
      sortQuery[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Calculate previous page
    if (pageNumber > 1) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }

    // Calculate next page
    if (endIndex < totalEvents) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }

    // Fetch data with the new start index and sorting
    result.data = await Event.find()
      .sort(sortQuery)
      .skip(startIndex)
      .limit(limit)
      .exec();

    result.limit = limit;

    return res.json({ msg: "Post Fetched successfully", data: result });
  } catch (error) {
    next(error);
  }
};

const registerOnEvent = async (req, res, next) => {
  const { name, email, dateOfBirthday, foundUsBy, eventId } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  const event = await findById(eventId, Event);

  if (event.error || !eventId) {
    return res.status(400).json({ message: "Couldn't find event" });
  }

  try {
    const participantExists = event.data.participants.some(
      (participant) => participant.email === email
    );
    if (participantExists) {
      return res
        .status(400)
        .json({ message: "Participant already registered with this email" });
    }

    const newParticipant = {
      name,
      email,
      dateOfBirthday: dateOfBirthday ? dateOfBirthday : "",
      foundUsBy: foundUsBy ? foundUsBy : "",
    };

    const registerParticipant = await eventUpdate(
      event.data._id,
      newParticipant
    );

    if (registerParticipant.error) {
      throw new AppError(
        "Failed to register participant.",
        500,
        1100,
        registerParticipant.error
      );
    }

    res.status(200).json(registerParticipant.data);
  } catch (error) {
    next(error);
  }
};

const getRegisteredParticipantToDay = async (req, res, next) => {
  const eventId = req.query.eventId;
  
  if (!eventId) {
    return res.status(400).json({ message: "Event id is required" });
  }
  try {
    const findEvent = await findById(eventId, Event);
  
    if (findEvent.error) {
      return res.status(400).json({ message: "Couldn't find event" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const registeredToday = findEvent.data.participants.filter(participant => {
      const createdAtDate = new Date(participant.createdAt);
      createdAtDate.setHours(0, 0, 0, 0);
      return createdAtDate.getTime() === today.getTime();
    });

    return res.json(registeredToday);
  } catch (error) {
    next(error);
  }
};

async function eventUpdate(eventId, newParticipant) {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      { $push: { participants: newParticipant } },
      { new: true, useFindAndModify: false } // Add options to return the updated document
    );
    return Result.Success(updatedEvent);
  } catch (error) {
    console.log("error", error);
    return Result.Fail(error);
  }
}

module.exports = {
  getAllEvents,
  registerOnEvent,
  getRegisteredParticipantToDay,
};
