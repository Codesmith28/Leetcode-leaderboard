import { clientPromise } from "@/util/DB";
import { UserCol } from "@/util/types";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw Error("GOOGLE_CLIENT_ID is not available in .env");
} else if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw Error("GOOGLE_CLIENT_SECRET is not available in .env");
}

const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, credentials, email, profile }) {
      const db = (await clientPromise).db("leetcodeleaderboard");
      const users = db.collection<UserCol>("Users");
      const userOnDB = await users.findOne({ email: user.email! });

      if (!userOnDB) {
        await users.insertOne({
          name: user.name!,
          email: user.email!,
          role: "Member",
        });
      }

      return true;
    },

    async jwt({ token }) {
      const user = await (await clientPromise)
        .db("leetcodeleaderboard")
        .collection<UserCol>("Users")
        .findOne({
          email: token.email!,
        });

      token.role = user?.role;
      token.username = user?.username;
      token.id = user?._id;
      return token;
    },
  },
});

export default authOptions;
