import { clientPromise } from "@/util/DB";
import { decodeReq } from "@/util/functions";
import { MySession, TeamCol } from "@/util/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await decodeReq(req);

  if (token) {
    if (req.method === "POST") {
      return POST(req, res, token as MySession["user"]);
    } else {
      return res.status(405).send("Method not allowed");
    }
  }
}

async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const { teamName, isInstitutional } = req.body;
  const newTeam: TeamCol = {} as TeamCol;
  newTeam.name = teamName;
  newTeam.members = [];
  newTeam.institution = isInstitutional ? teamName : "none";

  const db = (await clientPromise).db("leetcodeleaderboard");
  const teamCollection = db.collection<TeamCol>("Teams");

  // Check if the team already exists
  const existingTeam = await teamCollection.findOne({ teamName });
  if (existingTeam) {
    return res.status(400).json({ error: "Team already exists" });
  }

  const insertResponse = await teamCollection.insertOne(newTeam);
  if (!insertResponse.acknowledged) {
    return res.status(500).json({ error: "Could not insert team" });
  }

  return res.status(200).send("Team added");
}
