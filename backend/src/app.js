const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const config = require("./config");
const foxRoutes = require("./routes/foxRoutes");
const voteRoutes = require("./routes/voteRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const { loadOpenApiSpec } = require("./openApi");

const openApiSpec = loadOpenApiSpec();
const app = express();

app.use(helmet());
app.use(
  cors({
    // Only frontend origin is allowed to call the API in the VM setup.
    origin(origin, callback) {
      if (!origin || origin === config.frontendOrigin) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS blokkert for denne origin."));
    }
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get("/api/docs.json", (req, res) => {
  res.json(openApiSpec);
});

app.use("/api/foxes", foxRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
