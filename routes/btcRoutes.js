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
  const limit = 60; // Set your desired limit
  let offset = 0;
  let allResults = [];

  try {
    // Fetch the first set of results
    let response = await fetch(address, limit, offset);
    let { total, results } = response.data;

    // Append the current results to allResults
    allResults = allResults.concat(results);

    // Calculate the remaining pages
    const remainingPages = Math.ceil((total - limit) / limit);

    // Fetch the remaining pages
    for (let i = 1; i <= remainingPages; i++) {
      offset = limit * i;
      response = await fetch(address, limit, offset);
      results = response.data.results;
      allResults = allResults.concat(results);
    }

    // Respond with all results
    res.json({ result: allResults });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

async function fetch(address, limit, offset) {
  const param = `v1/brc-20/balances/${address}?limit=${limit}&offset=${offset}`;
  return await callAPI(param);
}

module.exports = router;
