import { UserCol } from "@/util/types";
import { ObjectId } from "mongodb";
import React from "react";
import UserListItem from "../UserListItem/UserListItem";
import styles from "./UserList.module.css";

interface userInfo {
  _id: ObjectId;
  name: string;
  username: string;
  email: string;
  institution: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  image: string;
}

function UserList({ members }: { members: UserCol[] }) {
  const transition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  return (
    <div className={styles.mainList}>
      {members.map((member, index) => (
        <UserListItem
          key={index}
          member={member}
          rank={index + 1}
          transition={{ ...transition, delay: index * 0.09 }}
        />
      ))}
    </div>
  );
}

export default UserList;
