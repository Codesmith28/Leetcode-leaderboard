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
  const userId = session.id;

  if (!teamId) return res.status(400).send("No team id provided");

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");

  const operation = [
    {
      $match: { _id: new ObjectId(userId) },
    },
    {
      $project: {
        isMember: {
          $in: [new ObjectId(teamId), "$teams"],
        },
      },
    },
    {
      $set: {
        isMember: {
          $cond: {
            if: { $eq: ["$isMember", true] },
            then: true,
            else: false,
          },
        },
      },
    },
  ];

  const result = await usersCollection.aggregate(operation).toArray();

  if (result.length > 0) {
    return res.status(200).send(result[0].isMember);
  } else {
    return res.status(200).send(false);
  }
}
