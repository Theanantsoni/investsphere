const axios = require("axios");

const fetchQuote = async (symbol) => {

  try {

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
      {
        params: {
          range: "1d",
          interval: "1d",
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const result = response.data.chart.result[0];

    if (!result) return null;

    const meta = result.meta;

    const current = meta.regularMarketPrice;

    const previous =
      meta.chartPreviousClose ||
      meta.previousClose;

    if (!current || !previous) {
      return {
        c: current || 0,
        dp: 0,
      };
    }

    const percent =
      ((current - previous) / previous) * 100;

    return {
      c: current,
      dp: percent,
    };

  } catch (err) {

    console.log("Yahoo Fetch Error:", err.message);

    return null;

  }

};

module.exports = fetchQuote;