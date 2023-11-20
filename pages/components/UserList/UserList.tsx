import React from "react";
import UserListItem from "../UserListItem/UserListItem";
import styles from "./UserList.module.css";

function UserList() {
  return (
    <div className={styles.mainList}>
      <UserListItem />
      <UserListItem />
      <UserListItem />
      <UserListItem />
      <UserListItem />
    </div>
  );
}

export default UserList;
