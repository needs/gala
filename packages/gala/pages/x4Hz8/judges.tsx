import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
    Stack,
    Switch,
} from '@mui/material';
import Head from 'next/head';
import EditJudgeDialog from '../../components/EditJudgeDialog';
import { Add } from '@mui/icons-material';
import { fullName } from '../../lib/utils';
import { Judge, store } from '../../lib/store';
import { useSyncedStore } from '@syncedstore/react';
import { v4 as uuidv4 } from 'uuid';
import { getLayoutInfo, menuAdmin } from '../../components/Layout';

function AddJudgeButton() {
  const [open, setOpen] = useState(false);
  const { judges } = useSyncedStore(store);
  const [judgeKey, setJudgeKey] = useState<string | undefined>(undefined);
  const judge = judgeKey !== undefined ? judges[judgeKey] : undefined;

  return (
    <>
      {judge !== undefined && <EditJudgeDialog
        open={open}
        onClose={() => setOpen(false)}
        judge={judge}
      />}
        <Button variant="outlined" onClick={() => {
          const judgeKey = uuidv4();
          judges[judgeKey] = {
            firstName: '',
            lastName: '',
          }
          setJudgeKey(judgeKey);
          setOpen(true);
          }} sx={{ width: 300, height: 150 }}>
          <Stack gap={1} alignItems="center" justifyContent="center" >
            <Add />
            <Box>Ajouter un juge</Box>
          </Stack>
        </Button>
    </>
  );
}

function EditJudgeButton({
  judge,
}: {
  judge: Judge;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditJudgeDialog
        open={open}
        onClose={() => setOpen(false)}
        judge={judge}
      />
      <Button onClick={() => setOpen(true)}>
        Modifier
      </Button>
    </>
  );
}

export default function Judges() {
  const { judges, extra } = useSyncedStore(store);

  const deleteJudge = (judgeKey: string) => {
    delete judges[judgeKey];
  };

  return (
    <>
      <Head>
        <title>Juges</title>
      </Head>
      <Stack padding={4} gap={4} direction="row">
        {Object.entries(judges).map(([judgeKey, judge]) => judge !== undefined && (
          <Card key={judgeKey} sx={{ width: 300, height: 150 }}>
            <CardContent>{fullName(judge)}</CardContent>
            <CardActions>
              <EditJudgeButton
                judge={judge}
              />
              <Button
                onDoubleClick={() => deleteJudge(judgeKey)}
              >
                Supprimer
              </Button>
            </CardActions>
          </Card>
        ))}
        <AddJudgeButton />
        <Switch checked={extra.antoinette === true} onChange={() => { extra.antoinette = !extra.antoinette }} />
      </Stack>
    </>
  );
}

Judges.layoutInfo = getLayoutInfo(menuAdmin, '/x4Hz8/judges');
