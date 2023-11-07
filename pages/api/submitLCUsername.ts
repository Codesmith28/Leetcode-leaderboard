import { clientPromise } from "@/util/DB";
import { MySession, UserCol } from "@/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { decode } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import authOptions from "../api/auth/[...nextauth]";

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
    username: string;
    institution: string;
  } = req.body;

  if (!body.username || !body.institution) {
    return res.status(400).json({ error: "Missing username or institution" });
  }

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const id = session.id;
  console.log(id);

  const updateUser = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        username: body.username,
        institution: body.institution,
      },
    }
  );

  if (!updateUser.acknowledged) {
    return res.status(500).json({ error: "Could not update user" });
  }

  return res.status(200).json({ message: "Success" });
}
