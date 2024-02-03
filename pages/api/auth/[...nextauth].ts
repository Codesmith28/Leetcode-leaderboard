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
          teams: [],
          LCTotalSolved: 0, // Add other properties with appropriate initial values
          LCEasySolved: 0,
          LCMediumSolved: 0,
          LCHardSolved: 0,
          ranking: 0,
          image: user.image!,
          visits: 1, // Track the total number of visits
        });
      } else {
        // If user exists, update the user's information in the database
        await users.updateOne(
          { email: user.email! },
          {
            $set: {
              name: user.name!,
              image: user.image!,
              // Update other fields as needed
            },
            $inc: {
              visits: 1, // Increment the total number of visits by 1
            },
          }
        );
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
      token.name = user?.name;
      token.image = user?.image;
      return token;
    },
  },
});

export default authOptions;
