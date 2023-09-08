// MODULES
const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });
const express = require("express");
const morgan = require("morgan");

// Creating the app
const app = express();

// MIDDLEWARE

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTERS

const tourRouter = require(`${__dirname}/routers/tourRouter`);
const userRouter = require(`${__dirname}/routers/userRouter`);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Starting the server
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
