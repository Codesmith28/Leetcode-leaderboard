import { clientPromise } from "@/util/DB";
import { decodeReq } from "@/util/functions";
import { MySession, UserCol } from "@/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await decodeReq(req);

  if (token) {
    if (req.method === "GET") {
      return GET(req, res, token as MySession["user"]);
    } else if (req.method === "DELETE") {
      return DELETE(req, res, token as MySession["user"]);
    } else {
      return res.status(405).send("Method not allowed");
    }
  }
}

async function GET(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const db = (await clientPromise).db("leetcodeleaderboard");
  // return all the teams available
  const teamsCollection = db.collection("Teams");
  const teams = await teamsCollection
    .aggregate([
      {
        $addFields: {
          totalMembers: { $size: "$members" },
        },
      },
      {
        $project: {
          members: 0, // Exclude the members field
        },
      },
    ])
    .toArray();

  return res
    .status(200)
    .json(teams.sort((a: any, b: any) => a.name.localeCompare(b.name)));
}

async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const teamId = req.body.teamId;

  const db = (await clientPromise).db("leetcodeleaderboard");
  const teamsCollection = db.collection("Teams");

  // Check if the team exists
  const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
  if (!team) {
    return res.status(400).json({ error: "Team does not exist" });
  }

  const deleteResponse = await teamsCollection.deleteOne({
    _id: new ObjectId(teamId),
  });

  if (!deleteResponse.acknowledged) {
    return res.status(500).json({ error: "Could not delete team" });
  }

  // Remove the team from all the users
  const usersCollection = db.collection<UserCol>("Users");
  const updateResponse = await usersCollection.updateMany(
    {},
    { $pull: { teams: teamId } }
  );

  if (!updateResponse.acknowledged) {
    return res.status(500).json({ error: "Could not delete team" });
  }

  return res.status(200).send("Team deleted");
}
