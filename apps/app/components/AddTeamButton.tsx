import { useState } from "react";
import { useCompetition } from "./StoreProvider";
import EditTeamDialog from "./EditTeamDialog";
import { Button } from "@mui/material";
import { addTeam, defaultTeam } from "../lib/team";
import { Add } from "@mui/icons-material";

export default function AddTeamButton({
  defaultCategoryKey,
  onAddTeam,
}: {
  defaultCategoryKey?: string;
  onAddTeam?: (teamKey: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { teams } = useCompetition();
  const [teamKey, setTeamKey] = useState<string | undefined>(undefined);
  const team = teamKey !== undefined ? teams[teamKey] : undefined;

  return (
    <>
      {team !== undefined && (
        <EditTeamDialog
          open={open}
          onClose={() => {
            setOpen(false);

            if (onAddTeam !== undefined && teamKey !== undefined) {
              onAddTeam(teamKey);
            }
          }}
          team={team}
        />
      )}
      <Button
        variant="outlined"
        onClick={() => {
          setTeamKey(
            addTeam(teams, { ...defaultTeam, categoryKey: defaultCategoryKey })
          );
          setOpen(true);
        }}
        startIcon={<Add />}
      >
        Équipe
      </Button>
    </>
  );
}
