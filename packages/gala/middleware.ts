import { auth, credential, initializeApp } from 'firebase-admin';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const app = initializeApp({
  credential: credential.cert("firebase-adminsdk-u4t1z@gala-8700f.iam.gserviceaccount.com"),
  databaseURL: "https://gala-8700f-default-rtdb.europe-west1.firebasedatabase.app"
});

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token')

  if (tokenCookie === undefined) {
    return NextResponse.redirect('/login')
  }

  const tokenData = await auth(app).verifyIdToken(tokenCookie.value)

  const email = tokenData.email
  const emailVerified = tokenData.email_verified

  if (emailVerified === undefined || emailVerified === false || email === undefined) {
    return NextResponse.redirect('/login')
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
