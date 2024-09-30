import React from "react";

const LeaderboardCard = ({ rank, teamname, university, score }) => {
  const hasContent = teamname && university && score && rank;
  const isTopThreeRanks = (rank) => {
    return rank === 1 || rank === 2 || rank === 3
      ? "drop-shadow-orange-glow bg-[#ef7226]"
      : "bg-black";
  };
  const isTopThreeRanksBorder = (rank) => {
    return rank === 1 || rank === 2 || rank === 3
      ? "drop-shadow-orange-glow"
      : "";
  };
  return (
    <div
      className={`relative p-[2px] rounded-lg mb-2 overflow-hidden bg-gradient-to-br from-[#ef7226] to-[#3e1a04] ${isTopThreeRanksBorder(rank)} w-full sm:w-auto`}
    >
      <div className="w-full p-4 sm:p-5 rounded-lg bg-black">
        <div className="flex flex-row items-center h-full">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-2xl sm:text-4xl font-bold dm-sans-800 border border-orange-500 text-white ${isTopThreeRanks(
              rank
            )}`}
          >
            {rank}
          </div>
          {hasContent ? (
            <>
              <div className="flex-grow px-3 sm:px-4 text-left">
                <div className="text-lg sm:text-2xl font-semibold text-white dm-sans-800 truncate">
                  {teamname}
                </div>
                <div className="text-sm sm:text-base truncate">
                  {university}
                </div>
              </div>
              <div className="pr-2 sm:pr-6 text-2xl sm:text-4xl font-bold text-white dm-sans-800">
                {score}
              </div>
            </>
          ) : (
            <div className="flex-grow text-center test-orange-500">
              DATA ISN'T AVAILABLE FOR THIS TEAM
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
