import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_PARAMS = import.meta.env.VITE_API_PARAMS;
const REFRESH_INTERVAL = parseInt(import.meta.env.VITE_REFRESH_INTERVAL, 10);
const CORS_PROXIES = import.meta.env.VITE_CORS_PROXIES.split(",");

const CACHE_KEY = "leaderboardData";
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

const useLeaderboardData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const fetchLeaderboardData = async () => {
    setIsValidating(true);
    const targetUrl = `${API_URL}?${API_PARAMS}`;

    for (const proxy of CORS_PROXIES) {
      try {
        const response = await axios.get(
          `${proxy}${encodeURIComponent(targetUrl)}`
        );

        const fetchedData = response.data.models || response.data;

        const mappedData = fetchedData.map((item) => ({
          rank: item.rank,
          teamname: item.hacker,
          university: "SLIIT",
          score: item.score,
        }));

        setData(mappedData);
        setError(null);
        setIsLoading(false);
        setIsValidating(false);

        // Update cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: mappedData,
            timestamp: Date.now(),
          })
        );

        return;
      } catch (err) {
        console.error(`Failed with proxy ${proxy}:`, err);
      }
    }

    setError("Unable to fetch leaderboard data. Please try again later.");
    setIsLoading(false);
    setIsValidating(false);
  };

  useEffect(() => {
    const loadCachedData = () => {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data: storedData, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
          setData(storedData);
          setIsLoading(false);
        }
      }
    };

    loadCachedData();
    fetchLeaderboardData();

    const interval = setInterval(fetchLeaderboardData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { data, error, isLoading, isValidating };
};

export default useLeaderboardData;
