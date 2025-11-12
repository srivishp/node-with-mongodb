const mongodb = require("mongodb");
// MongoClient constant to connect to MongoDB server
const MongoClient = mongodb.MongoClient;

// _db is a private variable to hold the database connection,only within this file
let _db = null;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://srivishp:Mongo2026@cluster0.1p7s5t7.mongodb.net/shop?appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// getDb function to retrieve the database connection
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
