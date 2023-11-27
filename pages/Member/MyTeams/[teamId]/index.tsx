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
  image: string;
}

interface Info {
  image: string;
  username: string;
  email: string;
  institution: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
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

  const [userInfo, setUserInfo] = useState<Info>({
    image: "",
    username: "",
    email: "",
    institution: "",
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: 0,
  });

  useEffect(() => {
    // to update the info of the user:
    const upDateInfo = async () => {
      const res = await fetch("/api/getInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      const res2 = await fetch(
        `https://leetcode-api-faisalshohag.vercel.app/${data.username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data2 = await res2.json();

      // combine the data from the two api calls:
      const combinedInfo: Info = {
        image: data.image,
        username: data.username,
        email: data.email,
        institution: data.institution,
        totalSolved: data2.totalSolved,
        easySolved: data2.easySolved,
        mediumSolved: data2.mediumSolved,
        hardSolved: data2.hardSolved,
        ranking: data2.ranking,
      };
      setUserInfo(combinedInfo);

      // update the database with the data2 in the database:
      const res3 = await fetch("/api/updateInfo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          easySolved: data2.easySolved,
          mediumSolved: data2.mediumSolved,
          hardSolved: data2.hardSolved,
          totalSolved: data2.totalSolved,
          ranking: data2.ranking,
        }),
      });
      const data3 = await res3.json();
    };
    upDateInfo();

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
