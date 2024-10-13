import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_PARAMS = import.meta.env.VITE_API_PARAMS;
const REFRESH_INTERVAL = parseInt(import.meta.env.VITE_REFRESH_INTERVAL, 10);
const CORS_PROXIES = import.meta.env.VITE_CORS_PROXIES.split(",");

const CACHE_KEY = "leaderboardData";
const CACHE_EXPIRATION = 1000; // 1 second

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
        const response = await axios.get(`${proxy}${targetUrl}`);

        // Fetching data from response
        const fetchedData = response.data.models || response.data;

        // Mapping the data with rank, teamname, and time_taken
        const mappedData = fetchedData.map((item) => ({
          rank: item.rank,
          teamname: item.hacker,
          university: "SLIIT",
          score: item.score,
          time_taken: item.time_taken, // Assuming this field is present
        }));

        // Sorting the data first by score, then by time_taken in ascending order
        mappedData.sort((a, b) => {
          if (a.rank === b.rank) {
            return a.time_taken - b.time_taken;
          }
          return a.rank - b.rank;
        });

        // Assigning new ranks (No rank repetition unless rank and time_taken are equal)
        let currentRank = 1;
        for (let i = 0; i < mappedData.length; i++) {
          if (
            i > 0 &&
            mappedData[i].rank === mappedData[i - 1].rank &&
            mappedData[i].time_taken === mappedData[i - 1].time_taken
          ) {
            mappedData[i].rank = mappedData[i - 1].rank; // Same rank if both rank and time_taken are the same
          } else {
            mappedData[i].rank = currentRank; // Assign new rank
          }
          currentRank++;
        }

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
