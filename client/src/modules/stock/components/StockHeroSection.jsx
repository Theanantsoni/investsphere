import React from "react";

const StockHeroSection = () => {

  return (

    <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Explore Stock Market
        </h1>

        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Discover top performing stocks, track live prices,
          analyze market trends and explore investment
          opportunities across Indian markets.
        </p>

        <div className="flex justify-center gap-8 mt-10 text-sm">

          <div>
            <p className="text-2xl font-bold">
              1800+
            </p>
            <p className="opacity-80">
              Listed Stocks
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              NSE
            </p>
            <p className="opacity-80">
              Exchange
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              Real Time
            </p>
            <p className="opacity-80">
              Market Data
            </p>
          </div>

        </div>

      </div>

    </section>

  );

};

export default StockHeroSection;