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
	const teamId = req.query.id as string;
	if (!teamId) return res.status(400).send("No team id provided");

	const db = (await clientPromise).db("leetcodeleaderboard");
	const teamCollection = db.collection<TeamCol>("Teams");
	const usersCollection = db.collection<UserCol>("Users");
 
	const team = await teamCollection
		.aggregate([
			{
				$match: {
					_id: new ObjectId(teamId),
				},
			},
			{
				$addFields: {
					totalMembers: { $size: "$members" },
				},
			},
			{
				$lookup: {
					from: "Users",
					localField: "members",
					foreignField: "_id",
					as: "members",
				},
			},
			{
				$unwind: "$members",
			},
			{
				$sort: {
					"members.ranking": 1,
				},
			},
			{
				$group: {
					_id: "$_id",
					name: { $first: "$name" },
					institution: { $first: "$institution" },
					members: { $push: "$members" },
					totalMembers: { $first: "$totalMembers" },
				},
			},
		])
		.toArray();

	if (!team) return res.status(400).send("No team found");

	return res.status(200).json(team[0]);
}
