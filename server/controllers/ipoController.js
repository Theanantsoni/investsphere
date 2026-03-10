const axios = require("axios");

// ============================================
// 🔥 IPO ROUTE
// ============================================

const getIPOs = async (req, res) => {

  const { type } = req.params;

  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = today.toISOString().slice(0, 10);

    let from, to;

    if (type === "ongoing") {

      from = todayStr;
      to = todayStr;

    } else {

      const past = new Date();
      past.setMonth(past.getMonth() - 24);
      from = past.toISOString().slice(0, 10);

      const future = new Date();
      future.setMonth(future.getMonth() + 6);
      to = future.toISOString().slice(0, 10);

    }

    const response = await axios.get(
      "https://finnhub.io/api/v1/calendar/ipo",
      {
        params: {
          from,
          to,
          token: process.env.FINNHUB_API_KEY
        }
      }
    );

    const ipoData = response.data?.ipoCalendar || [];

    let formatted = ipoData
      .filter(ipo => ipo.symbol && ipo.name && ipo.exchange)
      .map((ipo) => {

        const ipoDate = new Date(ipo.date);
        ipoDate.setHours(0, 0, 0, 0);

        let status = "closed";

        if (ipoDate > today) {
          status = "upcoming";
        }
        else if (ipoDate.getTime() === today.getTime()) {
          status = "ongoing";
        }

        let openDate, closeDate;

        if (status === "upcoming") {

          openDate = ipo.date;

          const close = new Date(ipoDate);
          close.setDate(close.getDate() + 3);

          closeDate = close.toISOString().slice(0, 10);

        }
        else if (status === "ongoing") {

          const open = new Date(ipoDate);
          open.setDate(open.getDate() - 1);

          openDate = open.toISOString().slice(0, 10);

          const close = new Date(ipoDate);
          close.setDate(close.getDate() + 1);

          closeDate = close.toISOString().slice(0, 10);

        }
        else {

          const open = new Date(ipoDate);
          open.setDate(open.getDate() - 3);

          openDate = open.toISOString().slice(0, 10);

          closeDate = ipo.date;

        }

        return {
          symbol: ipo.symbol,
          name: ipo.name,
          exchange: ipo.exchange,
          type: ipo.exchange,
          price: ipo.price || "N/A",
          numberOfShares: ipo.numberOfShares || 0,
          totalSharesValue: ipo.totalSharesValue || 0,
          openDate,
          closeDate,
          status,
        };

      });

    formatted = formatted.filter(ipo => ipo.status === type);

    if (type === "ongoing" && formatted.length === 0) {

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      formatted = [
        {
          symbol: "DEMO",
          name: "Live Market IPO Ltd.",
          exchange: "NSE",
          type: "EQUITY",
          price: "₹ 125 - 135",
          numberOfShares: 2500000,
          totalSharesValue: 337500000,
          openDate: yesterday.toISOString().slice(0, 10),
          closeDate: tomorrow.toISOString().slice(0, 10),
          status: "ongoing",
        }
      ];

    }

    formatted.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));

    res.json(formatted);

  }
  catch (err) {

    console.error("Finnhub Error:", err.message);

    res.json([]);

  }

};

module.exports = {
  getIPOs
};