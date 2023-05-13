import React, { useState } from 'react';
import { ref, set, push, child, remove } from 'firebase/database';
import {
  Judge,
  antoinetteSchema,
  database,
  judgesSchema,
  useDatabaseValue,
} from '../../lib/database';
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
import Loading from '../../components/Loading';
import EditJudgeDialog from '../../components/EditJudgeDialog';
import { Add } from '@mui/icons-material';
import { fullName } from '../../lib/utils';

function AddJudgeButton({ onAdd }: { onAdd: (judge: Judge) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditJudgeDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(player) => {
          onAdd(player);
          setOpen(false);
        }}
        judge={{
          firstName: '',
          lastName: '',
        }}
      />
        <Button variant="outlined" onClick={() => setOpen(true)} sx={{ width: 300, height: 150 }}>
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
  onChange,
}: {
  judge: Judge;
  onChange: (judge: Judge) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditJudgeDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(player) => {
          onChange(player);
          setOpen(false);
        }}
        judge={judge}
      />
      <Button onClick={() => setOpen(true)}>
        Modifier
      </Button>
    </>
  );
}

const judgesRef = ref(database, 'judges');
const antoinetteRef = ref(database, 'antoinette');

export default function Judges() {
  const judges = useDatabaseValue(judgesRef, judgesSchema);
  const antoinette = useDatabaseValue(antoinetteRef, antoinetteSchema);

  const addJudge = (judge: Judge) => {
    const newJudgeKey = push(judgesRef).key;

    if (newJudgeKey === null) {
      throw new Error('newJudgeKey is null');
    }

    set(child(judgesRef, newJudgeKey), judge);
    return newJudgeKey;
  };

  const updateJudge = (judgeKey: string, judge: Judge) => {
    set(child(judgesRef, judgeKey), judge);
  };

  const deleteJudge = (judgeKey: string) => {
    remove(child(judgesRef, judgeKey));
  };

  if (judges === undefined) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Juges</title>
      </Head>
      <Stack padding={4} gap={4} direction="row">
        {Object.entries(judges).map(([judgeKey, judge]) => (
          <Card key={judgeKey} sx={{ width: 300, height: 150 }}>
            <CardContent>{fullName(judge)}</CardContent>
            <CardActions>
              <EditJudgeButton
                judge={judge}
                onChange={(judge) => updateJudge(judgeKey, judge)}
              />
              <Button
                onDoubleClick={() => deleteJudge(judgeKey)}
              >
                Supprimer
              </Button>
            </CardActions>
          </Card>
        ))}
        <AddJudgeButton onAdd={addJudge} />
        <Switch checked={antoinette === true} onChange={() => set(antoinetteRef, !antoinette)} />
      </Stack>
    </>
  );
}
