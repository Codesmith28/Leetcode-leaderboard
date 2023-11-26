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
import React, { useEffect, useState } from "react";
import styles from "./TeamPlate.module.css";

// team info prop:
interface teamInfo {
  name: string;
  institution: string;
  totalMembers: number;
  topThree: ObjectId[];
  members: ObjectId[];
  disabled: boolean;
}

function TeamPlate({ teamId }: { teamId: string }) {
  const [teamInfo, setteamInfo] = useState<teamInfo>({
    name: "",
    institution: "",
    totalMembers: 0,
    topThree: [],
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
        console.log("num", teamData);
        setteamInfo(teamData);
      };
      getTeamInfo();
    }
  }, [teamId]);

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
              #1
            </Heading>
            <Heading size={"sm"} color={"silver"} textDecor={"underline"}>
              #2
            </Heading>
            <Heading size={"sm"} color={"brown"} textDecor={"underline"}>
              #3
            </Heading>
          </div>
        </div>
      </Card>
    </>
  );
}
export default TeamPlate;
