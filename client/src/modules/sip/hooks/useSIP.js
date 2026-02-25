// sip/hooks/useSIP.js
import { useEffect, useState } from "react";
import axios from "axios";

const useSIP = () => {
  const [sipData, setSipData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/sip")
      .then(res => setSipData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { sipData, loading };
};

export default useSIP;