import React from "react";
import Layout from "./Layout";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import styles from "/styles/Profile.module.css";

function Profile() {
  return (
    <Layout>
      <div className={styles.whole}>
        <ProfileCard />
      </div>
    </Layout>
  );
}

export default Profile;
