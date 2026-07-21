import { useEffect, useState } from "react";
import API from "../../config/api";

const MarketLiveBoard = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch(`${API}/api/ticker`);
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();
        if (Array.isArray(data)) setStocks(data.slice(0, 15));
      } catch {
        setStocks([]);
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!stocks.length) return null;

  const loopData = [...stocks, ...stocks, ...stocks]; // triple duplicate for seamless loop

  return (
    <div className="w-full bg-white border-b border-gray-200 overflow-hidden">

      <div className="flex gap-6 whitespace-nowrap animate-marquee hover:[animation-play-state:paused] px-4 py-3">

        {loopData.map((stock, index) => {
          const isUp = Number(stock.percent) >= 0;

          return (
            <div
              key={index}
              className="min-w-[150px] bg-gray-50 hover:bg-gray-100 
                         transition rounded-lg px-4 py-3 
                         shadow-sm border border-gray-200"
            >
              {/* Line 1 */}
              <div className="text-[12px] font-semibold text-gray-500 truncate">
                {stock.symbol}
              </div>

              {/* Line 2 */}
              <div className="text-base font-bold text-gray-900 mt-1">
                ${stock.price}
              </div>

              {/* Line 3 */}
              <div
                className={`text-[12px] font-semibold mt-1 ${
                  isUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {isUp ? "+" : ""}
                {stock.percent}%
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default MarketLiveBoard;