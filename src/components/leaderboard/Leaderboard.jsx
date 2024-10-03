import React, { useState, useEffect } from "react";
import axios from "axios";
import LeaderboardCard from "./LeaderboardCard";
import Pagination from "../Pagination";

const API_URL = import.meta.env.VITE_API_URL;
const API_PARAMS = import.meta.env.VITE_API_PARAMS;
const REFRESH_INTERVAL = parseInt(import.meta.env.VITE_REFRESH_INTERVAL, 10);
const CORS_PROXIES = import.meta.env.VITE_CORS_PROXIES.split(",");
const ITEMS_PER_PAGE = 10;

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      const targetUrl = `${API_URL}?${API_PARAMS}`;

      for (const proxy of CORS_PROXIES) {
        try {
          const response = await axios.get(
            `${proxy}${encodeURIComponent(targetUrl)}`
          );

          const data = response.data.models || response.data;

          const mappedData = data.map((item) => ({
            rank: item.rank,
            teamname: item.hacker,
            university: "SLIIT",
            score: item.score,
          }));

          setLeaderboardData(mappedData);
          setError(null);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error(`Failed with proxy ${proxy}:`, err);
        }
      }

      setError("Unable to fetch leaderboard data. Please try again later.");
      setIsLoading(false);
    };

    fetchLeaderboardData();

    const interval = setInterval(fetchLeaderboardData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(leaderboardData.length / ITEMS_PER_PAGE);
  const paginatedData = leaderboardData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 mb-8 max-w-4xl mx-auto mt-9">
      <div className="flex flex-col items-center gap-2 md:gap-1 mb-2 w-full">
        <h1 className="dm-sans-800 tracking-normal pointer-events-none text-4xl text-white py-2 px-4 w-full text-center relative">
          <span>The Leaderboard</span>
        </h1>
        <p className="dm-sans-400 mb-20 text-white text-xl text-center mt-1 tracking-wide">
          Real-time competition standings
        </p>
        <div className="space-y-7 lg:w-full md:w-3/4 sm:w-3/4">
          {error ? (
            <div className="text-red-500 text-2xl font-bold text-center">
              {error}
            </div>
          ) : isLoading ? (
            <div className="text-orange-500 text-2xl font-bold text-center">
              Loading...
            </div>
          ) : paginatedData.length > 0 ? (
            <>
              <div className="space-y-7">
                {paginatedData.map((item) => (
                  <LeaderboardCard key={item.rank} {...item} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  theme={{
                    pages: {
                      base: "xs:mt-0 mt-2 inline-flex items-center gap-3.5 font-semibold text-white",
                      previous: {
                        base: "w-11 h-11 [&>svg]:h-6 [&>svg]:w-6 rounded-full flex justify-center disabled:opacity-40 items-center enabled:hover:bg-white/10 transition-all duration-medium text-white",
                      },
                      next: {
                        base: "w-11 h-11 [&>svg]:h-6 [&>svg]:w-6 rounded-full flex justify-center disabled:opacity-40 items-center enabled:hover:bg-white/10 transition-all duration-medium text-white",
                      },
                      selector: {
                        base: "w-11 h-11 rounded-full bg-white/10 text-white enabled:hover:bg-white/20 transition-all duration-medium",
                        active: "pointer-events-none bg-white text-black",
                      },
                    },
                  }}
                />
              </div>
            </>
          ) : (
            <div className="text-orange-500 text-2xl font-bold text-center">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
