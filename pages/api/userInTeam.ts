import { clientPromise } from "@/util/DB";
import { MySession, TeamCol } from "@/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionToken = req.cookies["next-auth.session-token"];
    if (!sessionToken) {
      return res.status(401).json({ error: "Session token not found" });
    }

    const token = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!token || !("user" in token)) {
      return res.status(401).json({ error: "Invalid token or user not found" });
    }

    const { teamId } = req.query;
    if (req.method === "PUT" && typeof teamId === "string") {
      const result = await addMemberToTeam(
        req,
        res,
        token as MySession["user"],
        teamId
      );
      return result;
    } else {
      return res.status(405).send("Method not allowed");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function addMemberToTeam(
  req: NextApiRequest,
  res: NextApiResponse,
  sessionUser: MySession["user"],
  teamId: string
) {
  try {
    const db = (await clientPromise).db("leetcodeleaderboard");
    const usersCollection = db.collection<TeamCol>("Teams");
    const id = new ObjectId(teamId);
    const userId = sessionUser.id;

    const updateUserResult = await usersCollection.updateOne(
      { _id: id },
      { $addToSet: { members: userId } }
    );

    if (!updateUserResult.matchedCount) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (!updateUserResult.modifiedCount) {
      return res.status(200).json({ message: "User is already a member" });
    }

    return res.status(200).json({ message: "User added to team" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
