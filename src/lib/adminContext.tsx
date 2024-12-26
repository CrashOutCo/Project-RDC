"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { GameStat } from "@prisma/client";
import { getGameStats } from "@/app/actions/adminAction";
import { ReactNode } from "react";

interface AdminContextType {
  gameStats: GameStat[];
  getGameStatsFromDb: (gameName: string) => Promise<GameStat[]>;
}

export const AdminContext = createContext<AdminContextType>({
  gameStats: [],
  getGameStatsFromDb: async () => [],
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [gameStats, setGameStats] = useState<GameStat[]>([]);

  const getGameStatsFromDb = useCallback(
    async (gameName: string): Promise<GameStat[]> => {
      console.log("Getting game stats from db");
      try {
        const gameStats = await getGameStats(gameName);
        setGameStats(gameStats);
        return gameStats;
      } catch (error) {
        console.error("Error getting game stats: ", error);
        return [];
      }
    },
    [],
  );

  const value = useMemo(
    () => ({ gameStats, getGameStatsFromDb }),
    [gameStats, getGameStatsFromDb],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
