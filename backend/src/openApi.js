const fs = require("fs");
const yaml = require("js-yaml");
const config = require("./config");

function loadOpenApiSpec() {
  const source = fs.readFileSync(config.openApiPath, "utf8");
  return yaml.load(source);
}

module.exports = {
  loadOpenApiSpec
};
