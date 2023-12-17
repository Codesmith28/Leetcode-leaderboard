import TeamPlate from "@/components/TeamPlate/TeamPlate";
import UserList from "@/components/UserList/UserList";
import Layout from "@/pages/Layout";
import { Role, UserCol } from "@/util/types";
import { Divider } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./CurrTeam.module.css";

interface teamInfo {
  _id: ObjectId;
  name: string;
  institution: string;
  totalMembers: number;
  members: userInfo[];
  disabled: boolean;
  myRank: number;
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

function index() {
  const route = useRouter();
  const teamId = route.query.teamId as string;
  const router = useRouter();

  const [teamInfo, setteamInfo] = useState<teamInfo>({
    _id: teamId as unknown as ObjectId,
    name: "",
    institution: "",
    totalMembers: 0,
    members: [],
    disabled: false,
    myRank: 0,
  });

  useEffect(() => {
    // update information of all members of the team:
    const updateMembersInfo = async () => {
      // Make an API call to fetch the team information from the database
      const resTeam = await fetch(`/api/getTeamInfo/${teamId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const teamData = await resTeam.json();
      console.log("error in:", teamData);
      setteamInfo(teamData);

      // Iterate through each member in the teamInfo.members array
      for (const member of teamData.members) {
        // Make an API call to fetch the member's information from the LeetCode API
        const res = await fetch(
          `https://leetcode-api-faisalshohag.vercel.app/${member.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const memberData = await res.json();

        // this data is correct:
        await fetch("/api/updateInfo", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: member._id,
            easySolved: memberData.easySolved,
            mediumSolved: memberData.mediumSolved,
            hardSolved: memberData.hardSolved,
            totalSolved: memberData.totalSolved,
            ranking: memberData.ranking,
          }),
        });
      }
    };

    if (teamId) {
      updateMembersInfo();
    }
  }, [router.isReady]);

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
