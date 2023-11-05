import { ObjectId } from "mongodb";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role?: "Admin" | "Member" | null;
      id?: ObjectId;
      LCUserName?: string;
    } & DefaultSession["user"];
  }
}