const express = require("express");
const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
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
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err)
        return res.status(404).json({
          status: "failed",
          message: `There was a error. (${err.message})`,
        });

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
    `${__dirname}/..dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      if (err)
        return res.status(404).json({
          status: "failed",
          message: `There was a error. (${err.message})`,
        });

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
    `${__dirname}../dev-data/data/tours-simple.json`,
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

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: "failed",
      message: "The body does not contain any name or price value",
    });
  next();
};

const router = express.Router();

router.param("id", (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  next();
});

router.route("/").get(getAllTours).post(checkBody, createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(checkBody, updateTour)
  .delete(deleteTour);

module.exports = router;
