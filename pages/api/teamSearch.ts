import { clientPromise } from "@/util/DB";
import { decodeReq } from "@/util/functions";
import { MySession, UserCol } from "@/util/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await decodeReq(req);

  if (token) {
    if (req.method === "GET") {
      return GET(req, res, token as MySession["user"]);
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
  const query = req.query;

  const maxResults = query.maxResults
    ? parseInt(query.maxResults as string)
    : 10;

  const page = query.page ? parseInt(query.page as string) : 1;

  const searchQuery = query.searchQuery as string;

  if (!searchQuery) {
    return res.status(400).json({ error: "No search query provided" });
  }

  const db = (await clientPromise).db("leetcodeleaderboard");
  const teamsCollection = db.collection<UserCol>("Users");
  const regex = new RegExp(searchQuery, "i");

  const teams = await teamsCollection
    .find({
      $or: [{ name: { $regex: regex } }],
    })
    .sort({ name: 1 })
    .skip((page - 1) * maxResults)
    .limit(maxResults)
    .toArray();

  console.log(" teams: ", teams);

  return res.status(200).json(teams);
}
