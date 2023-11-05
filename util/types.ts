import { ObjectId } from "mongodb";

export type UserCol = {
  name: string;
  email: string;
  LCuserName?: string;
  LCTotalSolved?: number;
  LCEasySolved?: number;
  LCMediumSolved?: number;
  LCHardSolved?: number;
  role: "Admin" | "Member" | undefined;
  _id?: ObjectId;
};
