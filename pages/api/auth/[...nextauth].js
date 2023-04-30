import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firestore } from '@/lib/firebase/firestore';

const adminEmails = ['minhhoangnguyen19122004@gmail.com','eaplimitedvn@gmail.com']

const authOptions = {
  adapter: FirestoreAdapter(firestore),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  callbacks:{
    session:({token,session,user})=>{
      if(adminEmails.includes(user.email)){
        return session
      }

    }
  }
}

export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req,res,authOptions)
  if(!adminEmails.includes(session?.user?.email)){
    res.status(401).send('not an admin')
    res.end()
  }
}