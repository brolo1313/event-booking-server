const Event = require("../models/event");
const { AppError } = require("../helpers/errors");
const { findById } = require("../helpers/default-db-actions")


const getAllEvents = (req, res, next) => {
  Event.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      next(error);
    });
};
module.exports = {
  getAllEvents,
};
