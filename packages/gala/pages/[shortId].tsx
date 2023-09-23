import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";

export const getServerSideProps = (async (context) => {
  const shortId = context.query.shortId as string;

  const screenShortId = await prisma.screenShortId.findUnique({
    where: {
      short_id: shortId
    }
  });

  if (screenShortId === null) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: `${screenShortId.gala_uuid}/screen/${screenShortId.screen_uuid}`,
      permanent: false,
    },
  };
}) satisfies GetServerSideProps;


export default function ShortIdPage() {}
