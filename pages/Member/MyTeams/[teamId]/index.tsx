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
      // Iterate through each member in the teamInfo.members array
      for (const member of teamInfo.members) {
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

        // Update the member's information in the teamInfo.members array
        const updatedMembers = teamInfo.members.map((m) => {
          if (m._id === member._id) {
            return {
              ...m,
              totalSolved: memberData.totalSolved,
              easySolved: memberData.easySolved,
              mediumSolved: memberData.mediumSolved,
              hardSolved: memberData.hardSolved,
              ranking: memberData.ranking,
            };
          }
          return m;
        });

        // Update the teamInfo state with the updated members information
        setteamInfo((prevState) => ({
          ...prevState,
          members: updatedMembers,
        }));

        // Update the member's information in the database using the updateInfo API
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

      updateMembersInfo();
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
