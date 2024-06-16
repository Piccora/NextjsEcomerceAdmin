import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { firestore } from '@/lib/firebase/firestore';
import storeAnyUser from '@/lib/firebase/storeAnyUser';
import { getServerSession } from 'next-auth';

// const adminEmails = ['minhhoangnguyen19122004@gmail.com', 'eaplimitedvn@gmail.com', 'authorizedworker@gmail.com'];
const adminEmails = ['tatuanminh31032004@gmail.com']

const authOptions = {
  adapter: FirestoreAdapter(firestore),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.SECRET,
  events: {
    session: async (message) => { console.log("Session is active") },
  },
  callbacks: {
    async session({ session, user }) {
      if (adminEmails.includes(user.email)) {
        return session;
      }

      console.log('Not authenticated as admin');
      return null;
    },
    async signIn({ user, account, profile }) {
      // Store user account information in your database here
      // console.log(account)
      // console.log(profile)
      // console.log(user)
      storeAnyUser(user);

      if (!adminEmails.includes(user.email)) {
        return false; // Prevent non-admin users from signing in
      }
      return true; // Allow admin users to sign in
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req,res,authOptions)
  if(!adminEmails.includes(session?.user?.email)){
    res.status(401)
    res.end()
  }
}