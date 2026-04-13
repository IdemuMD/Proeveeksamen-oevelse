const path = require("path");

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foxvote",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://10.12.2.221",
  randomFoxApiUrl: process.env.RANDOM_FOX_API_URL || "https://randomfox.ca/floof/",
  randomFoxImageBase: process.env.RANDOM_FOX_IMAGE_BASE || "https://randomfox.ca/images/",
  topDefaultLimit: Number(process.env.TOP_DEFAULT_LIMIT || 5),
  openApiPath: path.join(__dirname, "..", "docs", "openapi.yaml")
};

module.exports = config;
