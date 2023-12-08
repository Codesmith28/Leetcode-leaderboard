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
  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const userId = session.id;

  // get all teams of that user from teams' array in user document
  const user = await usersCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(userId) },
      },
      {
        $unwind: "$teams", // Deconstruct the teams array
      },
      {
        $lookup: {
          from: "Teams", // Collection name
          localField: "teams",
          foreignField: "_id",
          as: "teamDetails",
        },
      },
      {
        $unwind: "$teamDetails", // Unwind the resulting teamDetails array
      },
      {
        $addFields: {
          numberOfMembers: { $size: "$teamDetails.members" }, // Calculate the size of the members array
        },
      },
      {
        $group: {
          _id: "$_id", // Group by user ID
          teams: {
            $push: {
              _id: "$teamDetails._id",
              // Add other fields from teamDetails if needed
              totalMembers: "$numberOfMembers",
              name: "$teamDetails.name",
              institution: "$teamDetails.institution",
            },
          }, // Push teamDetails into an array
        },
      },
      {
        $project: {
          _id: 1,
          teams: 1, // Include only the teams field in the output
        },
      },
    ])
    .toArray();

  return res.status(200).json(user[0].teams);
}
