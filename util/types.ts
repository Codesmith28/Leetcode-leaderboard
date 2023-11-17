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

  Teams: string[];
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
} | null;

export type TeamCol =
  | {
      _id?: ObjectId;
      name: string;
      members: string[];
      institutional: true; // Set the default value to true
      institution: string; // Make institution field mandatory by default
    }
  | {
      _id?: ObjectId;
      name: string;
      members: string[];
      institutional: false; // Added a branch for when institutional is false
      institution?: string; // Make institution field optional when institutional is false
    };
