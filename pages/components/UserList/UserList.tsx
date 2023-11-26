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
}

function UserList({ members }: { members: userInfo[] }) {
  return (
    <div className={styles.mainList}>
      {members.map((member, index) => (
        <UserListItem key={index} member={member} rank={index + 1} />
      ))}
    </div>
  );
}

export default UserList;
