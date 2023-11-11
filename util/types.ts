import { ObjectId } from "mongodb";
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
  };
};
