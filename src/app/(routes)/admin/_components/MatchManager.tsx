import { Player } from "@prisma/client";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import PlayerSessionManager from "./PlayerSessionManager";
import PlayerSelector from "./PlayerSelector";
import { FormValues } from "./EntryCreatorForm";
import { Button } from "@/components/ui/button";

interface Props {
  setIndex: number;
}

const MatchManager = (props: Props) => {
  const { control, getValues } = useFormContext<FormValues>();
  const { setIndex } = props;
  const { append, remove, fields } = useFieldArray({
    name: `sets.${setIndex}.matches`,
    control,
  });
  const players = getValues(`players`);

  /**
   *  Handles create new match button click.
   * Creates a new child Match under parent set
   */
  const handleNewMatchClick = () => {
    console.log("Handling New Match click", players);
    const playerSessions = players.map((player: Player) => ({
      playerId: player.playerId,
      playerSessionName: player.playerName,
      playerStats: [],
    }));
    console.log("Player Sessions: ", playerSessions);
    append({
      matchWinner: [],
      playerSessions: playerSessions,
    });
  };

  return (
    <div>
      {fields.map((match, matchIndex) => {
        return (
          <div key={match.id} className="flex flex-col justify-between">
            <div id="match-manager-header" className="flex justify-between">
              <label>Match {matchIndex + 1}</label>
              <Button
                className="bg-red-400 text-white hover:bg-red-300"
                type="button"
                onClick={() => remove(matchIndex)}
              >
                - Remove Match
              </Button>
            </div>
            <Separator className="my-4 h-[1px] bg-slate-400" />
            <PlayerSessionManager
              setIndex={setIndex}
              matchIndex={matchIndex}
              players={players}
            />
            <div className="flex justify-center text-lg">
              Match Winner for Match {matchIndex + 1}{" "}
            </div>
            <Controller
              name={`sets.${setIndex}.matches.${matchIndex}.matchWinner`}
              control={control}
              render={({ field }) => (
                <PlayerSelector
                  rdcMembers={players}
                  control={control}
                  field={field}
                />
              )}
            />
          </div>
        );
      })}
      <Button
        className="rounded-md bg-purple-900 p-1 font-semibold text-white hover:bg-purple-950"
        type="button"
        onClick={handleNewMatchClick}
      >
        + Add Match
      </Button>
    </div>
  );
};

export default MatchManager;
