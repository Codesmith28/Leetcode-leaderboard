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
    } else if (req.method === "DELETE") {
      return DELETE(req, res, token as MySession["user"]);
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
  const users = await usersCollection.find({}).toArray();

  const userId = session.id;
  const query = req.query;
  const searchQuery = query.searchQuery as string;

  const page = query.page ? parseInt(query.page as string) : 1;
  const pageSize = query.pageSize ? parseInt(query.pageSize as string) : 8;

  const pipeline = [
    {
      $match: { _id: new ObjectId(userId) },
    },
    {
      $unwind: "$users",
    },
  ];
}

async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const userId = req.body.userId;

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

  if (result.deletedCount === 1) {
    return res.status(200).send("User deleted successfully");
  } else {
    return res.status(500).send("Error deleting user");
  }
}

async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  session: MySession["user"]
) {
  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const user = req.body;
  const result = await usersCollection.insertOne(user);

  // if (result.insertedCount === 1) {
  //   return res.status(200).send("User added successfully");
  // } else {
  //   return res.status(500).send("Error adding user");
  // }
}
