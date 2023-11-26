import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { userInfo } from "os";
import React, { useEffect, useState } from "react";
import styles from "./TeamPlate.module.css";

// team info prop:
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
}

function TeamPlate({ teamId }: { teamId: string }) {
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

  // names of top three members of the team
  const topThree = teamInfo.members.slice(0, 3);

  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        className={styles.mainCard}
      >
        <div className={styles.plateHead}>
          <Heading size={"lg"}>{teamInfo.name}</Heading>

          <Heading size={"md"} color={"gray"}>
            {teamInfo.institution}
          </Heading>
        </div>

        <div>
          {/* total members */}
          <Heading size={"sm"}>Total Members : {teamInfo.totalMembers}</Heading>

          <div className={styles.topThree}>
            <Heading size={"sm"} color={"gold"} textDecor={"underline"}>
              #1 {topThree[0]?.name || "N/A"}
            </Heading>
            <Heading size={"sm"} color={"silver"} textDecor={"underline"}>
              #2 {topThree[1]?.name || "N/A"}
            </Heading>
            <Heading size={"sm"} color={"brown"} textDecor={"underline"}>
              #3 {topThree[2]?.name || "N/A"}
            </Heading>
          </div>
        </div>
      </Card>
    </>
  );
}
export default TeamPlate;
