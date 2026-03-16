import { useState, useEffect } from "react";
import axios from "axios";

const useSIP = () => {
  const [sipData, setSipData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSIP = async () => {
      try {
        const res = await axios.get(
          "https://api.mfapi.in/mf"
        );

        // IMPORTANT FIX
        setSipData(Array.isArray(res.data) ? res.data : res.data.data || []);

      } catch (error) {
        console.error("SIP fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSIP();
  }, []);

  return { sipData, loading };
};

export default useSIP;