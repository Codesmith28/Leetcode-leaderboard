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
	const body: {
		teamId: ObjectId;
	} = req.body;

	if (!body.teamId || !ObjectId.isValid(body.teamId)) {
		return res.status(400).json({ error: "Invalid teamId" });
	}

	const db = (await clientPromise).db("leetcodeleaderboard");
	const usersCollection = db.collection<UserCol>("Users");
	const teamsCollection = db.collection<TeamCol>("Teams");
	const userId = session.id;

	// Update user's teams and team's members without duplicates
	const updateUser = await usersCollection.updateOne(
		{
			_id: new ObjectId(userId),
			teams: { $not: { $elemMatch: { $eq: new ObjectId(body.teamId) } } },
		},
		{
			$addToSet: { teams: new ObjectId(body.teamId) },
		}
	);

	const updateTeam = await teamsCollection.updateOne(
		{
			_id: new ObjectId(body.teamId),
			members: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } },
		},
		{
			$addToSet: { members: new ObjectId(userId) },
		}
	);

	if (!updateUser.acknowledged || !updateTeam.acknowledged) {
		return res.status(500).json({ error: "Could not update user" });
	}

	return res.status(200).json({ message: "Success" });
}
