import { clientPromise } from "@/util/DB";
import { MySession, UserCol } from "@/util/types";
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

  return res.status(200).json(teams);
}
