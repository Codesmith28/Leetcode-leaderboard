import { clientPromise } from "@/util/DB";
import { MySession, UserCol } from "@/util/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import authOptions from "../api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const session: any = await getServerSession(req, res, authOptions);
  console.log(session,655);
  if (!session) {
    return res.status(403).send("Not logged in");
  }
  if (req.method === "PUT") {
    return PUT(req, res, session);
  } else {
    return res.status(405).send("Method not allowed");
  }
}

async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Exclude<MySession, null>
) {
  const body: {
    username: string;
    institution: string;
  } = req.body;
  console.log(body);

  if (!body.username || !body.institution) {
    return res.status(400).json({ error: "Missing username or institution" });
  }

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("users");
  const id = session?.user.id;
  console.log(session);
  // console.log(id);
  const updateUser = await usersCollection.updateOne(
    { _id: id },
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
