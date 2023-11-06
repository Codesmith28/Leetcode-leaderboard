import { ObjectId } from "mongodb";

type Role = "Admin" | "Member";

export type UserCol = {
  name: string;
  email: string;
  LCUserName?: string;
  LCTotalSolved?: number;
  LCEasySolved?: number;
  LCMediumSolved?: number;
  LCHardSolved?: number;
  role: Role;
  _id?: ObjectId;
};

export type MySession = {
  user: {
    id: ObjectId;
    role: Role;
    name: string;
    email: string;
    image: string;
  };
} | null;
