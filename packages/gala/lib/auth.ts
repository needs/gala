import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { PageProps } from '../pages/_app';
import { merge } from 'lodash';
import { getUserEmail } from '@gala/auth';

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
    const userEmail = await getUserEmail(context.req.cookies['token']);

    if (userEmail === undefined) {
      return redirectToLogin;
    }

    let extraProps: GetServerSidePropsResult<PageProps> = { props: {} };

    if (callback !== undefined) {
      extraProps = await callback(context)
    }

    return merge(extraProps, {
      props: {
        userInfo: userEmail
      }
    });
  }
}
