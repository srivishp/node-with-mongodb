// getDb method to get access to the database
const getDb = require("../util/database").getDb;
class Product {
  constructor(title, imageUrl, description, price) {
    // We can add an id, but MongoDB will auto-generate its own unique '_id', which we will be using
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();
    // Collection in which we want to insert data
    // If it doesn't exist, it will be created automatically
    // Check MongoDB docs for all CRUD operations
    return db
      .collection("products")
      .insertOne(this)
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
}

module.exports = Product;
