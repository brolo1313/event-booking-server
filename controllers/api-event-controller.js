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

    // Fetch all data without sorting
    const allEvents = await Event.find().exec();

    const sortBy = req.query.sortBy || 'title';
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // default sorting order is ascending

    if (sortBy === 'title') {
      // Custom sort for titles based on numerical part
      allEvents.sort((a, b) => {
        const getNumber = title => parseInt(title.match(/\d+/)?.[0], 10) || 0;
        const numA = getNumber(a.title);
        const numB = getNumber(b.title);
        return sortOrder * (numA - numB);
      });
    } else if (sortBy === 'eventDate') {
      // Sort by eventDate
      allEvents.sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        return sortOrder * (dateA - dateB);
      });
    } else {
      allEvents.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
        if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
        return 0;
      });
    }

    // Paginate the sorted data
    const paginatedEvents = allEvents.slice(startIndex, endIndex);

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

    result.items = paginatedEvents;
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
