import React from "react";
import styles from "styles/Layout.module.css";
import Navbar from "./components/Navbar/Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.main}>
      <div className={styles.nav}>
        <Navbar />
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
}

export default Layout;
