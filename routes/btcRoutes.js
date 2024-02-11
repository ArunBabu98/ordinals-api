const express = require("express");
const { callAPI } = require("../api/btcHiro");
const router = require("express").Router();

// Middleware to parse JSON request bodies
router.use(express.json());

// Checks if the server is running
router.get("/isActive", (req, res) => {
  console.log("Running");
  res.status(200).json({ response: "active" });
});

// checks the status of Hiro
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

// Lists all the inscriptions owned by an address
router.get("/listInscription", async (req, res) => {
  const address = req.query.address;
  const limit = 60; // Set your desired limit
  let offset = 0;
  let allResults = [];
  try {
    // Fetch the first set of results
    let response = await fecthInscriptions(address, limit, offset);
    let { total, results } = response.data;

    // Append the current results to allResults
    allResults = allResults.concat(results);

    // Calculate the remaining pages
    const remainingPages = Math.ceil((total - limit) / limit);

    // Fetch the remaining pages
    for (let i = 1; i <= remainingPages; i++) {
      offset = limit * i;
      response = await fecthInscriptions(address, limit, offset);
      results = response.data.results;
      allResults = allResults.concat(results);
    }

    // Respond with all results
    console.log(allResults.length);
    res.json({ result: allResults });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get BRC-20 balances of a specified address
router.get("/getBrc20Balances", async (req, res) => {
  const address = req.query.address;
  const limit = 60; // Set your desired limit
  let offset = 0;
  let allResults = [];

  try {
    // Fetch the first set of results
    let response = await fetchBalances(address, limit, offset);
    let { total, results } = response.data;

    // Append the current results to allResults
    allResults = allResults.concat(results);

    // Calculate the remaining pages
    const remainingPages = Math.ceil((total - limit) / limit);

    // Fetch the remaining pages
    for (let i = 1; i <= remainingPages; i++) {
      offset = limit * i;
      response = await fetchBalances(address, limit, offset);
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

// helper method for fetching brc-20 balances
async function fetchBalances(address, limit, offset) {
  const param = `v1/brc-20/balances/${address}?limit=${limit}&offset=${offset}`;
  return await callAPI(param);
}

// helper method for inscription
async function fecthInscriptions(address, limit, offset) {
  const param = `v1/inscriptions?address=${address}&limit=${limit}&offset=${offset}`;
  return await callAPI(param);
}

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

// get inscription info
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

// Get sats ordinal info
router.get("/ordinals", async (req, res) => {
  const id = req.query.id;
  const param = `v1/sats/${id}`;
  try {
    const response = await callAPI(param);
    const rarities = checkRarity(response.data, id);
    response.data.rarity = rarities;
    console.log(rarities);
    res.json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

function checkRarity(data, ordinalNumber) {
  var degreeNotation = data.degree;
  var block = data.coinbase_height;
  var allRarity = [data.rarity];
  // Split the degree notation into its components
  const degreeParts = degreeNotation.split("°");
  const A = parseInt(degreeParts[0]); // Cycle index
  const remainingParts = degreeParts[1].split("′");
  const B = parseInt(remainingParts[0]); // Index of block in halving epoch
  const remainingParts2 = remainingParts[1].split("″");
  const C = parseInt(remainingParts2[0]); // Index of block in difficulty adjustment period
  const D = parseInt(remainingParts2[1]); // Index of sat in the block
  console.log(A, B, C, D);
  if (degreeNotation.endsWith("4999999999‴")) {
    if (C === "2015") {
      // black rare
      allRarity.push("Black Rare");
    } else if (B == "209999") {
      // black epic
      allRarity.push("Black Epic");
    } else {
      // Black Uncommon
      allRarity.push("Black Uncommon");
    }
  }
  if (isPalindromeNumber(ordinalNumber)) {
    allRarity.push("Palindrome");
  }
  if (satoshiBlocks.includes(block)) {
    allRarity.push("Satoshi Nakamoto");
  }
  if (block == "9") {
    allRarity.push("Block 9");
  }
  if (block == "78") {
    allRarity.push("Block 78");
  }
  if (parseInt(block) < 1000) {
    allRarity.push("Vintage");
  }
  if (parseInt(block) >= 45000000000 && parseInt(block) <= 45999999999) {
    allRarity.push("First TX");
  }
  console.log(block);
  console.log(parseInt(block));
  if (parseInt(block) >= 24087 && parseInt(block) <= 56787) {
    allRarity.push("Pizza");
  }
  return allRarity;
}

const satoshiBlocks = [
  9, 286, 688, 877, 1760, 2459, 2485, 3479, 5326, 9443, 9925, 10645, 14450,
  15625, 15817, 19093, 23014, 28593, 29097,
];
function isPalindromeNumber(num) {
  // Convert number to string
  const numStr = num.toString();

  // Reverse the string
  const reversedNumStr = numStr.split("").reverse().join("");

  // Check if the original string is equal to the reversed string
  return numStr === reversedNumStr;
}

// To get the content of inscription
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

module.exports = router;
