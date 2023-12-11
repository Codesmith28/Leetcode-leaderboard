import { clientPromise } from "@/util/DB";
import { decodeReq } from "@/util/functions";
import { MySession, UserCol } from "@/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { decode, getToken } from "next-auth/jwt";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const token = await decodeReq(req);

	if (token === null) {
		return res.status(403).end();
	}

	if (req.method === "GET") {
		return GET(req, res, token);
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
	const id = session.id;

	const user = await usersCollection.findOne({ _id: new ObjectId(id) });
	if (!user) {
		return res.status(500).json({ error: "Could not find user" });
	}

	const isFirstTime = !user.hasOwnProperty("username"); // Checking existence of "username" property
	return res.status(200).json({ isFirstTime });
}
