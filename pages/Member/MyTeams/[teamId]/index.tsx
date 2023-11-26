import Layout from "@/pages/Layout";
import TeamPlate from "@/pages/components/TeamPlate/TeamPlate";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import React from "react";
import styles from "./CurrTeam.module.css";

function index() {
  const route = useRouter();
  const teamId = route.query.teamId as string;
  
  return (
    <>
      <Layout>
        <TeamPlate teamId={teamId} />
      </Layout>
    </>
  );
}

export default index;
