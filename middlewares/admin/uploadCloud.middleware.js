const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
module.exports.upload = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next(); // Không có file thì bỏ qua

  try {
    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: "products" }, // Tạo thư mục lưu trữ
          (error, result) => {
            if (result) {
              console.log("✅ Ảnh upload thành công:", result.url);
              resolve(result.url); // Trả về URL ảnh
            } else {
              console.error("❌ Lỗi upload ảnh:", error);
              reject(error);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    // **Upload tất cả ảnh lên Cloudinary**
    const uploadPromises = req.files.map((file) => streamUpload(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    req.body.thumbnail = uploadedUrls; // Gán URL ảnh vào req.body
    console.log("✅ Tất cả ảnh đã upload:", req.body.thumbnail);

    next(); // Tiếp tục sang middleware tiếp theo
  } catch (error) {
    console.error("❌ Lỗi khi upload ảnh:", error);
    res.status(500).json({ error: "Lỗi khi upload ảnh" });
  }
};
