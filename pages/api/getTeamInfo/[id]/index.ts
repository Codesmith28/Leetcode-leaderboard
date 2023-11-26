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

  if (req.method === "GET") {
    return GET(req, res, token as MySession["user"]);
  } else {
    return res.status(405).send("Method not allowed");
  }
}

async function GET(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const teamId = req.query.id as string;
  if (!teamId) return res.status(400).send("No team id provided");

  const db = (await clientPromise).db("leetcodeleaderboard");
  const teamCollection = db.collection<TeamCol>("Teams");
  const userCollection

  // get all information of the team with the given id
  // additionally get total number of members in the team and a sorted list of all memebers which are sorted as per their ranks
  const team = await teamCollection.findOne({ id: teamId });
  if (!team) {
    return res.status(400).send("No team found with the given id");
  }

  // Get the total number of members in the team
  const totalMembers = team.members.length;

  // Get the data of the users in the team and sort them by ranking
  const members = await userCollection
    .find({ _id: { $in: team.members } })
    .sort({ ranking: 1 })
    .toArray();

  // Add the totalMembers and sorted members to the team object
  const teamData = {
    ...team,
    totalMembers,
    members,
  };

  return res.st