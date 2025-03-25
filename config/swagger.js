const swaggerAutogen = require("swagger-autogen")();
const path = require("path");

// Cấu hình Swagger
const doc = {
  info: {
    title: "My API",
    description: "API documentation for Admin and Client",
    version: "1.0.0",
  },
  host: "localhost:3010",
  schemes: ["http"],
  tags: [
    {
      name: "Admin",
    },
    {
      name: "Client",
    },
  ],
};

// Định nghĩa đầy đủ cả admin và client routes
const outputFile = "../swagger-output.json";
const routes = [
  "../routes/admin/index.route.js",
  "../routes/client/index.route.js",
];

swaggerAutogen(outputFile, routes, doc);
