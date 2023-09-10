// MODULES
const dotenv = require("dotenv");

dotenv.config({ path: `./config.env` });
const express = require("express");
const morgan = require("morgan");
// eslint-disable-next-line import/no-extraneous-dependencies
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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "The Park Camper",
  price: 997,
});

testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log(err.message);
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
