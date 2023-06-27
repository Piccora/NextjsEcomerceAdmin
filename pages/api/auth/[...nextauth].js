import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firestore } from '@/lib/firebase/firestore';
import storeAnyUser from '@/lib/firebase/storeAnyUser';
import { getServerSession } from 'next-auth';

const adminEmails = ['minhhoangnguyen19122004@gmail.com', 'eaplimitedvn@gmail.com', 'authorizedworker@gmail.com'];

const authOptions = {
  adapter: FirestoreAdapter(firestore),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (adminEmails.includes(user.email)) {
        return session;
      }

      console.log('Not authenticated as admin');
      return null;
    },
    signIn: async ({ user }) => {
      // Store user account information in your database here
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