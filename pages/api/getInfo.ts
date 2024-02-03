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
    } else if (req.method === "POST") {
      return POST(req, res, token as MySession["user"]);
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
  const usersCollection = db.collection<UserCol>("Users");
  const id = session.id;

  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    return res.status(500).json({ error: "Could not find user" });
  }

  return res.status(200).json(user);
}

async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  // get the new username from the request body
  const { username } = req.body;

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const id = session.id;

  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (!user) {
    return res.status(500).json({ error: "Could not find user" });
  }

  // check if this username is already taken
  const usernameExists = await usersCollection.findOne({ username });

  if (usernameExists) {
    return res.status(500).json({ message: "Username already taken" });
  }

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { username } }
  );

  if (!result.modifiedCount) {
    return res.status(500).json({ message: "Could not update user" });
  }

  return res.status(200).json({ message: "Updated username" });
}
