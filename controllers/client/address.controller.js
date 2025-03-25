const Address = require("../../models/address.model");

module.exports.index = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ user_id: userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.addPost = async (req, res) => {
  try {
    const {
      titleAddress,
      name,
      lastName, // Use camelCase for consistency
      email,
      phone,
      city,
      districts,
      ward,
      address,
      status,
    } = req.body;

    const { userId } = req.params;
    console.log(userId);

    // Create new address
    const newAddress = new Address({
      user_id: userId,
      titleAddress,
      name,
      lastName,
      email,
      phone,
      city,
      districts,
      ward,
      address,
      status,
    });

    await newAddress.save();

    res
      .status(201)
      .json({ message: "Address added successfully", data: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports.editAddress = async (req, res) => {
  try {
    const {
      titleAddress,
      name,
      last_name,
      email,
      phone,
      city,
      districts,
      ward,
      address,
      status,
    } = req.body;
    const { addressId } = req.params;
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId },
      {
        titleAddress,
        name,
        last_name,
        email,
        phone,
        city,
        districts,
        ward,
        address,
        status,
      },
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
    });
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
