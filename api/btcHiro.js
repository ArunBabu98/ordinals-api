const axios = require("axios");

async function callAPI(param) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.hiro.so/ordinals/${param}`,
    headers: {
      Accept: "application/json",
    },
  };

  const response = await axios.request(config);
  return response;
}

module.exports = { callAPI };
