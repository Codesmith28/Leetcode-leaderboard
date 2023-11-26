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

  // get all information of the team with the given id
  // additionally get total number of members in the team and a sorted list of all memebers which are sorted as per their ranks
  const team = await teamCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(teamId),
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          name: 1,
          members: {
            $map: {
              input: "$members",
              as: "member",
              in: {
                _id: "$$member._id",
                name: "$$member.name",
                rank: "$$member.rank",
                score: "$$member.score",
              },
            },
          },
        },
      },
    ])
    .toArray();

  if (team.length === 0) {
    return res.status(400).send("No team found with the given id");
  }

  return res.status(200).json(team[0]);
}
