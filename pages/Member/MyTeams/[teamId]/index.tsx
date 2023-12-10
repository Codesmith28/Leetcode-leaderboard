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
  const router = useRouter();
  // fetch data from leetcode api for all users and update it in the database:

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
        console.log("user: ", member.username, "data: ", memberData);
        // set the member's info 

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
