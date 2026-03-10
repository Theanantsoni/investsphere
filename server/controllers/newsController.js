const axios = require("axios");

let cachedMarketNews = {};
let lastMarketNewsFetch = 0;

const getMarketNews = async (req, res) => {

  try {

    const page = Number(req.query.page) || 1;
    const category = req.query.category || "market";
    const limit = 6;

    const query =
      category === "ipo"
        ? "IPO India stock listing"
        : category === "sip"
          ? "SIP mutual fund India"
          : category === "stock"
            ? "stock market India shares NSE BSE"
            : "stock market finance India";

    const now = Date.now();

    if (
      cachedMarketNews[category] &&
      now - lastMarketNewsFetch < 300000
    ) {

      const cachedData = cachedMarketNews[category];

      const startIndex = (page - 1) * limit;

      const paginated =
        cachedData.slice(startIndex, startIndex + limit);

      return res.json({
        page,
        totalPages: Math.ceil(cachedData.length / limit),
        news: paginated,
      });

    }

    const response = await axios.get(
      "https://gnews.io/api/v4/search",
      {
        params: {
          q: query,
          lang: "en",
          max: 18,
          apikey: process.env.GNEWS_API_KEY,
        },
      }
    );

    const articles = response.data?.articles || [];

    const formatted = articles.map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      url: item.url,
      source: item.source?.name || "Unknown",
      publishedAt: item.publishedAt,
    }));

    cachedMarketNews[category] = formatted;
    lastMarketNewsFetch = now;

    const startIndex = (page - 1) * limit;

    const paginated =
      formatted.slice(startIndex, startIndex + limit);

    res.json({
      page,
      totalPages: Math.ceil(formatted.length / limit),
      news: paginated,
    });

  } catch (error) {

    console.error("Market News Error:", error.message);

    res.status(500).json({
      page: 1,
      totalPages: 1,
      news: [],
    });

  }

};

module.exports = {
  getMarketNews
};