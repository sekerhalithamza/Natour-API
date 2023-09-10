// MODULES
const dotenv = require("dotenv");

dotenv.config({ path: `./config.env` });
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// DATABASE
const DB = process.env.DATABASE.replace(
  "<USERNAME>",
  process.env.DATABASE_USER_NAME
).replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection succesful");
  });

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
