import { clientPromise } from "@/util/DB";
import { decodeReq } from "@/util/functions";
import { MySession, TeamCol, UserCol } from "@/util/types";
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

  const db = (await clientPromise).db("leetcodeleaderboard");
  const teamsCollection = db.collection<TeamCol>("Teams");

  let teamsQuery = {}; // Default query to fetch all teams

  if (searchQuery) {
    // If search query exists, add it to the query
    const regex = new RegExp(searchQuery, "i");
    teamsQuery = { name: { $regex: regex } };
  }

  const teams = await teamsCollection
    .find(teamsQuery)
    .sort({ name: 1 })
    .skip((page - 1) * maxResults)
    .limit(maxResults)
    .toArray();

  console.log("teams: ", teams);

  if (searchQuery && teams.length === 0) {
    // If search query provided and no teams found, return not found status
    return res.status(404).json({ error: "No teams found" });
  }

  return res.status(200).json(teams);
}