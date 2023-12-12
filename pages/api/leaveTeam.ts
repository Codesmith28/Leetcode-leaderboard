import { clientPromise } from "@/util/DB";
import { decodeReq } from "@/util/functions";
import { MySession, TeamCol, UserCol } from "@/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await decodeReq(req);

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
  const userId = session.id;
  const { teamId } = req.body;

  const db = (await clientPromise).db("leetcodeleaderboard");
  const userCollection = db.collection<UserCol>("Users");
  const teamCollection = db.collection<TeamCol>("Teams");

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  const team = await teamCollection.findOne({ _id: new ObjectId(teamId) });

  if (user && team) {
    const newMembers = team.members.filter((memberId) => memberId !== userId);
    const newTeams = user.teams.filter((userTeamId) => userTeamId !== teamId);

    await teamCollection.updateOne(
      { _id: new ObjectId(teamId) },
      { $set: { members: newMembers } }
    );

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { teams: newTeams } }
    );

    return res.status(200).json({ message: "User removed from the team" });
  } else {
    return res.status(404).send("User or team not found");
  }
}
