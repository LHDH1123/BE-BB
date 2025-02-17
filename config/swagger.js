const swaggerAutogen = require("swagger-autogen")();

// Cấu hình Swagger
const doc = {
  info: {
    title: "My API",
    description: "API documentation for managing brands and categories",
    version: "1.0.0",
  },
  host: "localhost:3010",
  schemes: ["http"],
};

const outputFile = "../swagger-output.json";
// Sử dụng path.join để xác định đúng đường dẫn tới file route
const routes = ["../routes/admin/index.route.js"]; // Đảm bảo đường dẫn chính xác

swaggerAutogen(outputFile, routes, doc);
