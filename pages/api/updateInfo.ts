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
    if (req.method === "PUT") {
      return PUT(req, res, token as MySession["user"]);
    } else {
      return res.status(405).send("Method not allowed");
    }
  }
}

async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const body: {
    _id: ObjectId;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSolved: number;
    ranking: number;
  } = req.body;

  if (
    !body._id ||
    !body.easySolved ||
    !body.mediumSolved ||
    !body.hardSolved ||
    !body.totalSolved ||
    !body.ranking
  ) {
    return res.status(400).json({ error: "Missing data!" });
  }

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const id = body._id;

  const updateUser = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        LCEasySolved: body.easySolved,
        LCMediumSolved: body.mediumSolved,
        LCHardSolved: body.hardSolved,
        LCTotalSolved: body.totalSolved,
        ranking: body.ranking,
      },
    }
  );

  if (!updateUser.acknowledged) {
    return res.status(500).json({ error: "Could not update user" });
  }

  return res.status(200).json({ message: "Success" });
}
