const Event = require("../models/event");
const { AppError } = require("../helpers/errors");
const { findById } = require("../helpers/default-db-actions")


const getAllEvents = async (req, res, next) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1; // Start page numbers at 1
    const limit = parseInt(req.query.limit) || 10;
    const result = {};
    const totalEvents = await Event.countDocuments().exec();

    const totalPages = Math.ceil(totalEvents / limit);
    // Calculate the start index
    let startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;
    result.totalEvents = totalEvents;
    result.totalPages = totalPages;
    
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

    // Fetch data with the new start index
    result.data = await Event.find()
      .skip(startIndex)
      .limit(limit)
      .exec();

    result.limit = limit;

    return res.json({ msg: "Post Fetched successfully", data: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAllEvents,
};
