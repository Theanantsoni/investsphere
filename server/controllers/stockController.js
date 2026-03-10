const axios = require("axios");

/* ===========================================
   ALL INDIAN STOCKS
=========================================== */

const getStocks = async (req, res) => {

  try {

    const listResponse = await axios.get(
      "https://archives.nseindia.com/content/equities/EQUITY_L.csv",
      {
        headers: { "User-Agent": "Mozilla/5.0" }
      }
    );

    const rows = listResponse.data.split(/\r?\n/);

    const stocks = rows
      .slice(1)
      .map(row => {

        const cols = row.split(",");

        return {
          symbol: cols[0]?.trim(),
          name: cols[1]?.trim()
        };

      })
      .filter(s => s.symbol);

    const limited = stocks.slice(0, 50);

    const prices = await Promise.all(

      limited.map(async (stock) => {

        try {

          const symbol = `${stock.symbol}.NS`;

          const response = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
            {
              params: {
                range: "1d",
                interval: "1d"
              },
              headers: {
                "User-Agent": "Mozilla/5.0"
              }
            }
          );

          const result = response.data.chart.result?.[0];

          if (!result) return null;

          const meta = result.meta;

          const current = meta.regularMarketPrice;
          const previous = meta.chartPreviousClose || meta.previousClose;

          const percent =
            previous && current
              ? ((current - previous) / previous) * 100
              : 0;

          return {
            id: symbol,
            symbol: stock.symbol,
            name: stock.name,
            price: current || 0,
            change: percent || 0,
            marketCap: "N/A"
          };

        } catch {
          return null;
        }

      })

    );

    res.json({
      stocks: prices.filter(Boolean),
      totalPages: 1
    });

  } catch (error) {

    console.log("Stock API Error:", error.message);

    res.json({
      stocks: [],
      totalPages: 1
    });

  }

};


/* ===========================================
   STOCK DETAIL API
=========================================== */

const getStockDetail = async (req, res) => {

  try {

    const symbol = req.params.symbol.toUpperCase();

    const yahooSymbol =
      symbol.includes(".NS")
        ? symbol
        : `${symbol}.NS`;

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
      {
        params: { range: "1d", interval: "1d" },
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "*/*"
        },
        timeout: 10000
      }
    );

    const result = response.data?.chart?.result?.[0];

    if (!result) {
      return res.json({
        symbol,
        name: symbol,
        price: 0,
        change: 0
      });
    }

    const meta = result.meta;

    const current = meta.regularMarketPrice || 0;

    const previous =
      meta.chartPreviousClose ||
      meta.previousClose ||
      0;

    const change =
      previous > 0
        ? ((current - previous) / previous) * 100
        : 0;

    res.json({

      symbol,

      name:
        meta.longName ||
        meta.shortName ||
        symbol,

      price: Number(current.toFixed(2)),

      change: Number(change.toFixed(2)),

      marketCap: meta.marketCap || 0,

      volume: meta.regularMarketVolume || 0,

      pe: null,
      eps: null,
      high52: meta.fiftyTwoWeekHigh || null,
      low52: meta.fiftyTwoWeekLow || null,
      dividend: null,
      sector: "N/A",
      description: "Company overview coming soon.",

      return1d: Number(change.toFixed(2)),
      return1m: null,
      return1y: null,
      return5y: null

    });

  } catch (error) {

    console.log("Stock detail error:", error.message);

    res.json({
      error: "Failed to fetch stock"
    });

  }

};

module.exports = {
  getStocks,
  getStockDetail
};