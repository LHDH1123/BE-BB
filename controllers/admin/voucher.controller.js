const Voucher = require("../../models/voucher.model");

// Lấy danh sách voucher
module.exports.index = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ deleted: false });
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getVoucher = async (req, res) => {
  try {
    const id = req.params.id;

    const vouchers = await Voucher.find({ _id: id, deleted: false });
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo mới voucher
module.exports.createPost = async (req, res) => {
  try {
    const { title, discount, status, description } = req.body;
    const newVoucher = new Voucher({ title, discount, status, description });
    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Chỉnh sửa voucher
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, discount, status, description } = req.body;
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { title, discount, status, description },
      { new: true }
    );
    res.status(200).json(updatedVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thay đổi trạng thái voucher
module.exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    res.status(200).json(updatedVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa mềm voucher
module.exports.deleteVoucher = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    res.status(200).json(deletedVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
