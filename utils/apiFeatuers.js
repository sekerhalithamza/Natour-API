class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const includedFields = [
      "name",
      "duration",
      "maxGroupSize",
      "difficulty",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
      "priceDiscount",
      "summary",
      "description",
      "imageCover",
      "images",
      "createdAt",
    ];

    // Basic filtering
    for (const el in queryObj) {
      if (includedFields.indexOf(el) < 0) {
        delete queryObj[el];
      }
    }

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.query = this.query.select(
        this.queryString.fields.split(",").join(" ")
      );
    }
    this.query = this.query.select("-__v");

    return this;
  }

  paginate() {
    if (this.queryString.page || this.queryString.limit) {
      const page = this.queryString.page ? this.queryString.page : 1;
      const limit = this.queryString.limit ? this.queryString.limit : 10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);

      return this;
    }
  }
}

module.exports = APIFeatures;
