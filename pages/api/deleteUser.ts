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

  if (token) {
    if (req.method === "DELETE") {
      return DELETE(req, res, token as MySession["user"]);
    } else {
      return res.status(405).send("Method not allowed");
    }
  }
}

async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const db = (await clientPromise).db("leetcodeleaderboard");
  const teamsCollection = db.collection<TeamCol>("Teams");
  const usersCollection = db.collection<UserCol>("Users");

  const userID = session.id;

  // Step 1: Get the user with the given userID
  const user = await usersCollection.findOne({ _id: new ObjectId(userID) });

  if (user) {
    // get all the ids of teams from teams array of user:
    const teams = user.teams;

    // remove the user from all the teams in teamsArray
    const operation1 = [
      {
        updateMany: {
          filter: { _id: { $in: teams } },
          update: {
            $pull: { members: new ObjectId(userID) },
          },
        },
      },
    ];

    const operation2 = [
      {
        deleteOne: {
          filter: { _id: new ObjectId(userID) },
        },
      },
    ];

    const res1 = await teamsCollection.bulkWrite(operation1);
    const res2 = await usersCollection.bulkWrite(operation2);

    if (res1 && res2) {
      return res.status(200).json("User deleted successfully");
    } else {
      return res.status(404).json("User not found");
    }
  } else {
    return res.status(404).json("User not found");
  }
}
