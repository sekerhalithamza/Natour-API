const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const emptyIds = [];

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find(el => el.id == req.params.id);
  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "Invalid id",
    });
  res.status(200).json({
    status: "success",

    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = emptyIds[0] ? emptyIds[0] : tours.length;
  const newTour = Object.assign({ id: newId, ...req.body });
  tours.push(newTour);
  if (emptyIds.indexOf(newId) > -1) emptyIds.splice(emptyIds.indexOf(newId), 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) return res.status(404).send("There was a error");

      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const oldTour = tours.find(el => el.id == req.params.id);

  if (!oldTour)
    return res.status(404).json({
      status: "fail",
      message: "Invalid id",
    });

  const newTour = { id: oldTour.id, ...req.body };
  tours.splice(oldTour.id, 1);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) return res.status(404).send("There was a error");

      res.status(200).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  const tour = tours.find(el => el.id == req.params.id);
  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "Invalid id",
    });

  tours.splice(tour.id, 1);
  emptyIds.push(tour.id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err) return res.status(404).send("There was a error");

      res.status(204).json({
        status: "success",
        data: null,
      });
    }
  );
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers).post(createUser);

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
