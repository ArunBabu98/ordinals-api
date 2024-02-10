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

router.get("/listInscription", async (req, res) => {
  const param = "v1/inscriptions";
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/transferPerBlock", async (req, res) => {
  const param = "v1/inscriptions/transfers";
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/inscription", async (req, res) => {
  const id = req.query.id;
  const param = `v1/inscriptions/${id}`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/inscriptionContent", async (req, res) => {
  const id = req.query.id;
  const param = `v1/inscriptions/${id}/content`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/inscriptionTransafers", async (req, res) => {
  const id = req.query.id;
  const param = `v1/inscriptions/${id}/transfers`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/ordinals", async (req, res) => {
  const id = req.query.id;
  const param = `v1/sats/${id}`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/getSatoshiInscriptions", async (req, res) => {
  const id = req.query.id;
  const param = `v1/sats/${id}/inscriptions`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/getAllBrc20Tokens", async (req, res) => {
  const param = `v1/brc-20/tokens`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/getBrc20TokenDetails", async (req, res) => {
  const ticker = req.query.ticker;
  const param = `v1/brc-20/tokens/${ticker}`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/getBrc20TokenHolders", async (req, res) => {
  const ticker = req.query.ticker;
  const param = `v1/brc-20/tokens/${ticker}/holders`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/getBrc20Balances", async (req, res) => {
  const address = req.query.address;
  const param = `v1/brc-20/balances/${address}`;
  try {
    const response = await callAPI(param);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
