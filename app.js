const fs = require("fs");
const express = require("express");

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const emptyIds = [];

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side!", app: "Natour" });
});

app.post("/", (req, res) => {
  res.send("You can post to this endpoint...");
});

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
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
});

app.post("/api/v1/tours", (req, res) => {
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
});

app.patch("/api/v1/tours/:id", (req, res) => {
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
});

app.delete("/api/v1/tours/:id", (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
