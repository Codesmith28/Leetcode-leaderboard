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
  const institutions = await teamsCollection
    .aggregate([
      {
        $match: {
          institution: { $ne: "none" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
        },
      },
    ])
    .toArray();

  return res
    .status(200)
    .json(institutions.sort((a: any, b: any) => a.name.localeCompare(b.name)));
}
