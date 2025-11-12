// * Sequelize is an easy-to-use and promise-based Node.js ORM tool for Postgres, MySQL, MariaDB, SQLite, DB2, Microsoft SQL Server, and Snowflake.
// * It features solid transaction support, relations, eager and lazy loading, read replication and more.
//-> Basically, it means that sequelize will handle all the SQl related stuff. So that we can focus on the developer can focus on the Node JS stuff.
//? ORM stands for Object Relational Mapping
//# We make use of sequelize by using objects which sequelize will translate it into SQL queries in the background and carry out the task.

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

// Creating a model
const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
