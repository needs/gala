import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { PageProps } from '../pages/_app';
import { merge } from 'lodash';
import { getUser } from '@gala/auth';
import { cookies } from 'next/dist/client/components/headers';
import { auth } from './firebase';

export type UserInfo = {
  foo: string
}

const redirectToLogin = {
  redirect: {
    destination: '/login',
    permanent: false,
  },
}

export const withAuth: (callback?: GetServerSideProps<PageProps>) => GetServerSideProps<PageProps> = (callback) => {
  return async (context) => {
    const user = await getUser(context.req.cookies['token']);

    if (user === undefined) {
      return redirectToLogin;
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
