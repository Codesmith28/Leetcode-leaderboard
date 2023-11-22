import { clientPromise } from "@/util/DB";
import { MySession, TeamCol } from "@/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const teamId = req.query.teamId as string; // Assuming teamId is in the query parameters
    return PUT(req, res, teamId as unknown as ObjectId);
  } else {
    return res.status(405).send("Method not allowed");
  }
}

async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  teamId: ObjectId
) {
  const body: {
    userId: ObjectId;
  } = req.body;

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<TeamCol>("Teams");
  const id = teamId;

  const addUserInTeam = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $push: {
        members: body.userId,
      },
    }
  );

  if (!addUserInTeam.acknowledged) {
    return res.status(500).json({ error: "Could not update user" });
  }

  return res.status(200).json({ message: "Success" });
}
