const { get } = require("../routes/admin");

const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectId;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  // adding the user's cart functionality
  addToCart(product) {
    // checking if product already exists in cart
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      // == can be used but using both sides toString() for safety & is also a good practice
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      // product exists in cart, incrementing quantity
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      // instead of {...product, quantity}, we are only storing the productId because if the product details change in the shop, the cart won't reflect that
      // so we will only refer to the id of product and manually fetch other details from products collection when needed
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
    // const existingProductIndex = cartProducts.findIndex(
    //   (cp) => cp.productId.toString() === product._id.toString()
    // );
  }

  // Updating old cart with a new cart

  static findById(userId) {
    const db = getDb();
    // findOne doesnt' return  cursor
    // find() does
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
