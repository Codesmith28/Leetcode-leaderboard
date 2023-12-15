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
    institution: string;
  } = req.body;

  if (!body.institution) {
    return res.status(400).json({ error: "Missing username or institution" });
  }

  const db = (await clientPromise).db("leetcodeleaderboard");
  const usersCollection = db.collection<UserCol>("Users");
  const teamsCollection = db.collection<TeamCol>("Teams");

  const userId = session.id;
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const oldInstitution = user.institution;
  const newInstitution = body.institution;

  const oldInstitutionId = await teamsCollection.findOne({
    institution: oldInstitution,
  });


  if (oldInstitution === "none") {
    const operation = [
      {
        updateOne: {
          filter: { _id: new ObjectId(userId) },
          update: {
            $set: { institution: newInstitution },
          },
        },
      },
    ];

    const res1 = await usersCollection.bulkWrite(operation);

    if (res1.modifiedCount > 0) {
      return res.status(200).json({ message: "Institution updated" });
    } else {
      return res.status(404).send("User not found");
    }
  } else if (oldInstitution === newInstitution) {
    return res.status(400).json({ error: "Same institution" });
  } else {
    const operation1 = [
      {
        updateOne: {
          filter: { institution: oldInstitution },
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
            $pull: { teams: oldInstitutionId?._id },
            $set: { institution: newInstitution },
          },
        },
      },
    ];

    const res1 = await teamsCollection.bulkWrite(operation1);
    const res2 = await usersCollection.bulkWrite(operation2);

    if (res1.modifiedCount > 0 && res2.modifiedCount > 0) {
      return res.status(200).json({ message: "Institution updated" });
    } else {
      return res.status(404).send("User or team not found");
    }
  }
}
