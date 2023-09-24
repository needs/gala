import { GetServerSideProps } from 'next';
import Screen from '../../../../components/Screen';
import { PageProps } from '../../../_app';

export default function Screen1() {
  return <Screen stageName="Plateau A" stageKey="stage1" />;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const galaUuid = context.query.uuid as string;
  return {
    props: {
      galaUuid,
    },
  };
};
