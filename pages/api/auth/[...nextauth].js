import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { firestore } from '@/lib/firebase/firestore';
import storeAnyUser from '@/lib/firebase/storeAnyUser';
import { getServerSession } from 'next-auth';

const adminEmails = process.env.ADMIN_EMAILS.split(' ')
 
export default NextAuth({
  adapter: FirestoreAdapter(firestore),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user }) {
      if (adminEmails.includes(user.email)) {
        return session;
      }

      console.log('Not authenticated as admin');
      return session;
    },
    async signIn({ user, account, profile }) {
      // Store user account information in your database here
      user["account"] = account
      storeAnyUser(user);

      if (!adminEmails.includes(user.email)) {
        return false; // Prevent non-admin users from signing in
      }
      return true; // Allow admin users to sign in
    },
  },
})

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req,res,authOptions)
  if(!adminEmails.includes(session?.user?.email)){
    res.status(401)
    res.end()
  }
}