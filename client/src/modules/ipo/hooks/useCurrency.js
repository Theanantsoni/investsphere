import { useEffect, useState } from "react";
import axios from "axios";

const useCurrency = () => {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );

        const inrRate = response.data?.rates?.INR;
        setRate(inrRate);
      } catch (error) {
        console.error("Currency API Error:", error.message);
        setRate(83); // fallback safe rate
      }
    };

    fetchRate();
  }, []);

  return rate;
};

export default useCurrency;
