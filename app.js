// MODULES
const dotenv = require("dotenv");

dotenv.config({ path: `./config.env` });
const express = require("express");
const morgan = require("morgan");

// DATABASE

// THE APP

// Creating the app
const app = express();

// MIDDLEWARE

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTERS

const tourRouter = require("./routers/tourRouter");
const userRouter = require("./routers/userRouter");

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Starting the server
const port = process.env.port || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});
