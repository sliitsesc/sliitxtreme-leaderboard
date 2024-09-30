import React, { useState, useEffect } from "react";
import LeaderboardCard from "./LeaderboardCard";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([
    { rank: 1, teamname: "Shark95", university: "SLIIT", score: 1500 },
    { rank: 2, teamname: "Player2", university: "Team A", score: 1400 },
    { rank: 3, teamname: "Player3", university: "Team B", score: 1300 },
    { rank: 4, teamname: "Player4", university: "Team C", score: 1200 },
    { rank: 5, teamname: "Player5", university: "Team D", score: 1100 },
  ]);

  // Uncomment this useEffect block and fetch function if you want to retrieve the data dynamically
  /*
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("https://api.example.com/leaderboard"); // Replace with your API endpoint
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);
  */

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 mb-8 max-w-4xl mx-auto mt-9">
      <div className="flex flex-col items-center gap-2 md:gap-1 mb-2 w-full">
        <h1 className="dm-sans-800 tracking-normal pointer-events-none text-4xl text-white py-2 px-4 w-full text-center relative">
          <span>The Leaderboard</span>
        </h1>
        <p className="dm-sans-400 mb-20 text-white text-xl text-center mt-1 tracking-wide">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
        <div className="space-y-7 lg:w-full md:w-3/4 sm:w-3/4">
          {leaderboardData.length > 0 ? (
            leaderboardData.map((item) => (
              <LeaderboardCard key={item.rank} {...item} />
            ))
          ) : (
            <div className="text-orange-500 text-2xl font-bold text-center">
              NO DATA AVAILABLE
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
