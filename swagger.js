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

const outputFile = "./swagger/swagger-output.json"; 
const routes = ["./routes/admin/index.route.js"];

swaggerAutogen(outputFile, routes, doc); 
