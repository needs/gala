import { GetServerSideProps } from 'next';
import Screen from '../../../../components/Screen';
import { PageProps } from '../../../_app';

export default function Screen2() {
  return <Screen stageName="Plateau B" stageKey="stage2" />;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const competitionUuid = context.query.uuid as string;
  return {
    props: {
      competitionUuid: competitionUuid,
    },
  };
};
