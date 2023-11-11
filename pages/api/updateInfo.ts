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
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSolved: number;
    ranking: number;
  } = req.body;

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const id = session.id;

  const updateUser = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        LCEasySolved: body.easySolved,
        LCMediumSolved: body.mediumSolved,
        LCHardSolved: body.hardSolved,
        LCTotalSolved: body.totalSolved,
      },
    }
  );

  if (!updateUser.acknowledged) {
    return res.status(500).json({ error: "Could not update user" });
  }

  return res.status(200).json({ message: "Success" });
}
