import { ObjectId } from "mongodb";

export type UserCol = {
  name: string;
  email: string;
  LCUserName?: string;
  LCTotalSolved?: number;
  LCEasySolved?: number;
  LCMediumSolved?: number;
  LCHardSolved?: number;
  role: "Admin" | "Member" | undefined;
  _id?: ObjectId;
};
