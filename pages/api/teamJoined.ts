import { clientPromise } from "@/util/DB";
import { MySession, TeamCol, UserCol } from "@/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionToken = req.cookies["next-auth.session-token"]!;
  const token = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  if (token === null) {
    return res.status(403).send("Not logged in");
  }

  if (req.method === "PUT") {
    return PUT(req, res, token as MySession["user"]);
  } else {
    return res.status(405).send("Method not allowed");
  }
}

async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const body: {
    teamId: ObjectId;
  } = req.body;

  if (!body.teamId || !ObjectId.isValid(body.teamId)) {
    return res.status(400).json({ error: "Invalid teamId" });
  }

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const teamsCollection = db.collection<TeamCol>("Teams");
  const userId = session.id;

  // push teamId to user's teams and usrId in team's members array
  const updateUser = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: { teams: new ObjectId(body.teamId) },
    }
  );

  const updateTeam = await teamsCollection.updateOne(
    { _id: new ObjectId(body.teamId) },
    {
      $push: { members: new ObjectId(userId) },
    }
  );

  if (!updateUser.acknowledged || !updateTeam.acknowledged) {
    return res.status(500).json({ error: "Could not update user" });
  }

  return res.status(200).json({ message: "Success" });
}
