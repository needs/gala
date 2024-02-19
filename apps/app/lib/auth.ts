import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { PageProps } from '../pages/_app';
import { merge } from 'lodash';
import { getRole, getUser } from '@tgym.fr/auth';
import { prisma } from './prisma';
import { getFirebaseAdminApp } from './firebase-admin';
import nookies from 'nookies';

export type UserInfo = {
  foo: string;
};

const redirectToLogin = {
  redirect: {
    destination: '/login',
    permanent: false,
  },
};

const redirectToHome = {
  redirect: {
    destination: '/',
    permanent: false,
  },
};

export const withAuth: (option: {
  checkMembership?: boolean;
  callback?: GetServerSideProps<PageProps>;
}) => GetServerSideProps<PageProps> = ({ checkMembership, callback }) => {
  return async (context) => {
    const idToken = nookies.get(context).token;
    const user = await getUser(getFirebaseAdminApp(), prisma, idToken);

    if (user === undefined) {
      return redirectToLogin;
    }

    if (checkMembership === true) {
      const competitionUuid = context.query.uuid as string;
      const role = await getRole(prisma, competitionUuid, user);

      if (role === undefined) {
        return redirectToHome;
      }
    }

    let extraProps: GetServerSidePropsResult<PageProps> = { props: {} };

    if (callback !== undefined) {
      extraProps = await callback(context);
    }

    return merge(extraProps, {
      props: {
        userInfo: user.email,
      },
    });
  };
};

export const withAuthCompetition = (selected: string) =>
  withAuth({
    checkMembership: true,
    callback: async (context) => {
      const competitionUuid = context.query.uuid as string;

      return {
        props: {
          competitionUuid: competitionUuid,

          layoutInfo: {
            menu: 'admin',
            selected,
            uuid: competitionUuid,
          },
        },
      };
    },
  });
