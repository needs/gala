import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { PageProps } from '../pages/_app';
import { merge, remove } from 'lodash';
import { getRole, getUser } from '@gala/auth';
import { cookies } from 'next/dist/client/components/headers';

export type UserInfo = {
  foo: string
}

const redirectToLogin = {
  redirect: {
    destination: '/login',
    permanent: false,
  },
}

const redirectToHome = {
  redirect: {
    destination: '/',
    permanent: false,
  },
}

export const withAuth: (option: { checkMembership?: boolean, callback?: GetServerSideProps<PageProps> }) => GetServerSideProps<PageProps> = ({ checkMembership, callback }) => {
  return async (context) => {
    const user = await getUser(context.req.cookies['session']);

    if (user === undefined) {
      context.res.setHeader('Set-Cookie', [ "session=deleted; Max-Age=0"]);
      return redirectToLogin;
    }

    if (checkMembership === true) {
      const galaUuid = context.query.uuid as string;
      const role = await getRole(galaUuid, user);

      if (role === undefined) {
        return redirectToHome;
      }
    }

    let extraProps: GetServerSidePropsResult<PageProps> = { props: {} };

    if (callback !== undefined) {
      extraProps = await callback(context)
    }

    return merge(extraProps, {
      props: {
        userInfo: user.email
      }
    });
  }
}

export const withAuthGala = (selected: string) => withAuth({
  checkMembership: true,
  callback: async (context) => {
    const galaUuid = context.query.uuid as string;

    return {
      props: {
        galaUuid,

        layoutInfo: {
          menu: 'admin',
          selected,
          uuid: galaUuid,
        },
      },
    };
  }
});
