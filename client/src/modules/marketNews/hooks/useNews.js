import { useEffect, useState } from "react";

const useNews = (page, category) => {
  const [news, setNews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/market-news?page=${page}&category=${category}`
        );
        const data = await res.json();

        setNews(data.news || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("News Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, category]);

  return { news, totalPages, loading };
};

export default useNews;