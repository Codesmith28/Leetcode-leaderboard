import Layout from "@/pages/Layout";
import TeamPlate from "@/pages/components/TeamPlate/TeamPlate";
import UserList from "@/pages/components/UserList/UserList";
import { Role, UserCol } from "@/util/types";
import { Divider } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./CurrTeam.module.css";

interface teamInfo {
  name: string;
  institution: string;
  totalMembers: number;
  members: userInfo[];
  disabled: boolean;
}

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
  role: Role;
  teams: ObjectId[];
}

function index() {
  const route = useRouter();
  const teamId = route.query.teamId as string;

  const [teamInfo, setteamInfo] = useState<teamInfo>({
    name: "",
    institution: "",
    totalMembers: 0,
    members: [],
    disabled: false,
  });

  useEffect(() => {
    if (teamId) {
      const getTeamInfo = async () => {
        const res = await fetch(`/api/getTeamInfo/${teamId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const teamData = await res.json();
        setteamInfo(teamData);
      };
      getTeamInfo();
    }
  }, [teamId]);

  const topThree = teamInfo.members.slice(0, 3);

  return (
    <>
      <Layout>
        <TeamPlate teamInfo={teamInfo} topThree={topThree} />
        <Divider marginBlock={"1em"} />
        <UserList members={teamInfo.members} />
      </Layout>
    </>
  );
}

export default index;
