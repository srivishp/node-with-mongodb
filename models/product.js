// getDb method to get access to the database
const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class Product {
  constructor(id, title, imageUrl, description, price) {
    // // We can add an id, but MongoDB will auto-generate its own unique '_id', which we will be using
    this._id = new mongodb.ObjectId(id);
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();
    let dbOperation;
    if (this._id) {
      dbOperation = db
        .collection("products")
        //? UpdateOne does not replace an existing item
        //-> $set operator updates the fields specified in the document
        // here it is 'this' (id, title, imageUrl, description, price)
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // Collection in which we want to insert data
      // If it doesn't exist, it will be created automatically
      // Check MongoDB docs for all CRUD operations
      dbOperation = db.collection("products").insertOne(this);
    }

    return dbOperation
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return (
      db
        .collection("products")
        //! find() without any parameters fetches all the documents; could be millions of them
        // Ideally, we should pass params or use pagination in the app to limit data fetching
        //? find() also allows a cursor to be returned for more complex queries
        //-> A cursor is an object that goes through our documents step-by-step
        .find()
        // MongoDB does not immediately return all matching documents. Instead, it returns a cursor object.
        //# We are using toArray() to interact with the cursor to get all the documents
        .toArray()
        .then((products) => {
          console.log(products);
          return products;
        })
        .catch((err) => console.log(err))
    );
  }

  static findById(prodId) {
    const db = getDb();
    return (
      db
        .collection("products")
        // prodId is a string, but _id in MongoDB is an ObjectId
        // So we need to convert it using mongodb package
        .find({ _id: new mongodb.ObjectId(prodId) })
        .next() // next() fetches the next document from the cursor
        .then((product) => {
          console.log(product);
          return product;
        })
        .catch((err) => console.log(err))
    );
  }
}

module.exports = Product;
