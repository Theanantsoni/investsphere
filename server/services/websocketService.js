const WebSocket = require("ws");

const initWebSocket = (server) => {

  const FINN_KEY = process.env.FINNHUB_API_KEY;

  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {

    console.log("Client connected");

    const socket =
      new WebSocket(
        `wss://ws.finnhub.io?token=${FINN_KEY}`
      );

    socket.on("open", () => {

      const symbols = [
        "AAPL",
        "MSFT",
        "TSLA",
        "AMZN",
        "RELIANCE.NS",
        "TCS.NS",
        "INFY.NS",
        "BINANCE:BTCUSDT"
      ];

      symbols.forEach(symbol => {

        socket.send(
          JSON.stringify({
            type: "subscribe",
            symbol
          })
        );

      });

    });

    socket.on("message", (data) => {

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data.toString());
      }

    });

    socket.on("error", (err) => {
      console.log("Finnhub WS error:", err.message);
    });

    ws.on("close", () => {

      console.log("Client disconnected");

      if (socket.readyState === WebSocket.OPEN) {
        socket.terminate();
      }

    });

    ws.on("error", () => { });

  });

};

module.exports = initWebSocket;