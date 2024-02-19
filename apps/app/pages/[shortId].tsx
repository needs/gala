import { GetServerSideProps } from 'next';
import { prisma } from '../lib/prisma';

export const getServerSideProps = (async (context) => {
  const shortId = context.query.shortId as string;

  const screenShortId = await prisma.screenShortId.findUnique({
    where: {
      shortId: shortId,
    },
  });

  if (screenShortId === null) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: `competition/${screenShortId.competitionUuid}/screen/${screenShortId.screenUuid}`,
      permanent: false,
    },
  };
}) satisfies GetServerSideProps;

export default function ShortIdPage() {
  return null;
}
