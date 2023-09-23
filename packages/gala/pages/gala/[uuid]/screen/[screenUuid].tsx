import { useGala } from '../../../../lib/store';
import { GetServerSideProps } from 'next';
import ScreenBar from '../../../../components/screens/ScreenBar';
import ScreenProgress from '../../../../components/screens/ScreenProgress';
import ScreenInvalid from '../../../../components/screens/ScreenInvalid';

export default function ScreenPage({ screenUuid }: { screenUuid: string }) {
  const { screens } = useGala();

  if (typeof screens[screenUuid] === 'undefined') {
    return <ScreenInvalid />
  }

  const screen = screens[screenUuid].value;

  switch (screen.type) {
    case 'bar': return <ScreenBar screen={screen} />;
    case 'progress': return <ScreenProgress screen={screen} />;
    default: return <ScreenInvalid />;
  }
}

export const getServerSideProps = (async (context) => {
  const galaUuid = context.query.uuid;
  const screenUuid = context.query.screenUuid;

  if (typeof galaUuid !== 'string' || typeof screenUuid !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      galaUuid,
      screenUuid,
    },
  };
}) satisfies GetServerSideProps;
