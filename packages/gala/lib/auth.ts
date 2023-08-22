import admin from 'firebase-admin';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { PageProps } from '../pages/_app';
import { merge } from 'lodash';

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
    const userInfo = await getUserInfo(context.req.cookies['token']);

    if (userInfo === undefined) {
      return redirectToLogin;
    }

    let extraProps: GetServerSidePropsResult<PageProps> = { props: {} };

    if (callback !== undefined) {
      extraProps = await callback(context)
    }

    return merge(extraProps, {
      props: {
        userInfo
      }
    });
  }
}

const getUserInfo = async (token: string | undefined) => {
  if (token === undefined) {
    return undefined;
  }

  const tokenData = await admin.auth().verifyIdToken(token).catch(() => {
    return undefined;
  })

  if (tokenData === undefined) {
    return undefined;
  }

  const email = tokenData.email
  const emailVerified = tokenData.email_verified

  if (emailVerified === undefined || emailVerified === false || email === undefined) {
    return undefined;
  }

  return {
    props: {
      foo: 'bar',
    },
  }
}
