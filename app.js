const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./utils/db");
const chalk = require("chalk");
// const createEvents = require("./utils/events");
const { createEvents } = require("./helpers/seed-script")

const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

const PORT = process.env.PORT || 3000;

// const corsOptions = {
//   origin: ["http://localhost:4202", "http://localhost:4201", "https://event-booking-client-gamma.vercel.app"],
// };

const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all standard methods
  allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
};


app.use(cors(corsOptions));

const apiProfileRoutes = require("./routes/api-event-routes");

connectDB();

// Start the server
app.listen(PORT, (error) => {
  error
    ? console.log(errorMsg(error))
    : console.log(successMsg(`Server listens on https//localhost:${PORT}`));
});

//MIDDLEWARE
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse JSON request body

//API
app.use(apiProfileRoutes);

// 👇 add a global error handler after all the routes.
app.use((err, req, res, next) => {
  err.statusCode = err?.statusCode || 500;
  err.code = err?.code || null;
  err.originalError = err?.originalError || 'Internal Server Error';

  const errorResponse = {
    status: err.statusCode,
    code: err.code,
    message: err.message,
    originalError: err.originalError
  };

  res.status(err.statusCode).json(errorResponse);
});


// createEvents();

module.exports = app;
