import Layout from "@/pages/Layout";
import { useRouter } from "next/router";
import React from "react";
import styles from "./CurrTeam.module.css";

function index() {
  const route = useRouter();
  const { teamId } = route.query;
  console.log("route = ", teamId);
  return (
    <>
      <Layout>
        <div>index</div>
      </Layout>
    </>
  );
}

export default index;
