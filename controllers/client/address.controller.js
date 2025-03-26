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
      last_name,
      email,
      phone,
      city,
      districts,
      ward,
      address,
      status,
    } = req.body;

    const { userId } = req.params;

    if (status === true) {
      // Nếu thêm địa chỉ mới là `status: true`, cập nhật tất cả địa chỉ khác thành `false`
      await Address.updateMany({ user_id: userId }, { status: false });
    }

    // Tạo địa chỉ mới
    const newAddress = new Address({
      user_id: userId,
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

    // Tìm địa chỉ hiện tại
    const existingAddress = await Address.findById(addressId);
    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (status === true) {
      // Nếu địa chỉ được chỉnh sửa có `status: true`, tất cả địa chỉ khác phải `false`
      await Address.updateMany(
        { user_id: existingAddress.user_id, _id: { $ne: addressId } },
        { status: false }
      );
    }

    // Cập nhật địa chỉ
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
