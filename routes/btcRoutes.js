const express = require("express");
const { callAPI } = require("../api/btcHiro");
const router = require("express").Router();

// Middleware to parse JSON request bodies
router.use(express.json());

router.get("/isActive", (req, res) => {
  console.log("Running");
  res.status(200).json({ response: "active" });
});

router.get("/status", async (req, res) => {
  const param = "v1/";
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
