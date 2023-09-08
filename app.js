// MODULES
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const exp = require("constants");

// Creating the app
const app = express();

// MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json());

// ROUTERS

const tourRouter = require(`${__dirname}/routers/tourRouter`);
const userRouter = require(`${__dirname}/routers/userRouter`);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Starting the server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
