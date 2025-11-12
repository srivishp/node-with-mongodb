const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const app = express();
const Order = require("./models/order");
const OrderItem = require("./models/order-items");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// #Creating a middleware to fetch a user and use it in requests
//-> This is run only for incoming requests & not during npm start
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//# Associations/Relations between models using Sequelize
// SQL concepts, check Sequelize docs for more info
// Adding one to many relationships between Shop, Order, Item & User
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
// Many to many relationship between Cart & Product through CartItem
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
// One to many relationship between Order & Product through OrderItem
Order.belongsToMany(Product, { through: OrderItem });
User.hasMany(Order);

// Syncs models to the DB by creating the appropriate tables and relations
sequelize
  //.sync({ force: true }) //? use { force: true } to drop and recreate tables on every server start
  .sync() //? use this for normal sync without dropping tables
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Luke", email: "luke@skywalker.com" });
    }
    return user;
  })
  .then((user) => {
    //console.log(user);

    user.createCart();
  })
  .then((cart) => {
    // change port number as per requirement
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000);
