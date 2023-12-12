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
  const userId = session.id;
  const { teamId } = req.body;

  const db = (await clientPromise).db("leetcodeleaderboard");
  const userCollection = db.collection<UserCol>("Users");
  const teamCollection = db.collection<TeamCol>("Teams");

  // const result = await teamCollection.updateOne(
  //   { _id: new ObjectId(teamId) },
  //   {
  //     $pull: { members: new ObjectId(userId) },
  //   }
  // );

  // if (result.matchedCount > 0) {
  //   await userCollection.updateOne(
  //     { _id: new ObjectId(userId) },
  //     {
  //       $pull: { teams: new ObjectId(teamId) },
  //     }
  //   );

  //   return res.status(200).json({ message: "User removed from the team" });
  // } else {
  //   return res.status(404).send("User or team not found");
  // }

  const operation1 = [
    {
      updateOne: {
        filter: { _id: new ObjectId(teamId) },
        update: {
          $pull: { members: new ObjectId(userId) },
        },
      },
    },
  ];

  const operation2 = [
    {
      updateOne: {
        filter: { _id: new ObjectId(userId) },
        update: {
          $pull: { teams: new ObjectId(teamId) },
        },
      },
    },
  ];

  console.time("one");
  const res1 = await teamCollection.bulkWrite(operation1);
  console.timeEnd("one");

  console.time("two");
  const res2 = await userCollection.bulkWrite(operation2);
  console.timeEnd("two");

  if (res1.modifiedCount > 0 && res2.modifiedCount > 0) {
    return res.status(200).json({ message: "User removed from the team" });
  } else {
    return res.status(404).send("User or team not found");
  }
}
  