import { ObjectId } from "mongodb";
import { type } from "os";
type Role = "Admin" | "Member";

export type UserCol = {
  name: string;
  email: string;
  username?: string;
  institution?: string;
  LCTotalSolved?: number;
  LCEasySolved?: number;
  LCMediumSolved?: number;
  LCHardSolved?: number;
  role: Role;
  _id?: ObjectId;
  teams: string[];
  ranking: number;
};

export type MySession = {
  user: {
    id: ObjectId;
    username: string;
    role: Role;
    name: string;
    email: string;
    image: string;
    institution?: string;
    LCTotalSolved?: number;
    LCEasySolved?: number;
    LCMediumSolved?: number;
    LCHardSolved?: number;
    Teams: string[];
    ranking: number;
  };
};

export type TeamCol = {
  _id?: ObjectId;
  name: string;
  members: ObjectId[];
  institution: string | null;
};
