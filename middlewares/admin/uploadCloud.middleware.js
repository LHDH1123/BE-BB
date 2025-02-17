const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports.upload = async (req, res, next) => {
  if (!req.file) return next(); // Nếu không có file, tiếp tục request

  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);
    req.body.thumbnail = result.url; // Lưu link ảnh vào req.body
    console.log(result.url);

    next(); // Tiếp tục middleware tiếp theo
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi khi upload ảnh" });
  }
};
