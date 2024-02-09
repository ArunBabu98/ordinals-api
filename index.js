const express = require("express");
const app = express();
// const dotenv = require("dotenv");
const btcordinal = require("./routes/btcRoutes");
// const { callNode } = require("./utils");
// const digiassetRoute = require("./routes/digiassetRoute");

// dotenv.config();

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Backend is Running!");
});

app.use(express.json());

app.use("/api/v2/btc-ordinals", btcordinal);
