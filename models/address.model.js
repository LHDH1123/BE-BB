const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user_id: String,
  titleAddress: String,
  name: String,
  last_name: String,
  email: String,
  phone: String,
  city: String,
  districts: String,
  ward: String,
  address: String,
  status: Boolean,
});

const Address = mongoose.model("Address", addressSchema, "address");

module.exports = Address;
