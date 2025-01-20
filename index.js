const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger-output.json");

const app = express(); // Đảm bảo khai báo app trước khi sử dụng

// Cấu hình Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
const port = process.env.PORT || 3000; // Đảm bảo có cổng mặc định nếu không có trong `.env`

// Kết nối database
const database = require("./config/database");
database.connect();

// Định nghĩa các route
const routeAdmin = require("./routes/admin/index.route");
// const routeClient = require("./routes/client/index.route");

// Kết nối các route với ứng dụng
routeAdmin(app);
// routeClient(app); // Bỏ comment nếu cần thêm route client

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
