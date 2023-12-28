import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import classNames from "classnames";
import { ObjectId } from "mongodb";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NotifToast from "../NotifToast/NotifToast";
import styles from "./TeamPlate.module.css";

// team info prop:
interface teamInfo {
  _id: ObjectId;
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
  image: string;
}

async function getOut({ teamId, toast }: { teamId: ObjectId; toast: any }) {
  const res = await fetch("/api/leaveTeam", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamId }),
  });

  if (res.status === 200) {
    NotifToast({
      title: "Team Left Successfully",
      status: "success",
      toast: toast,
    });
    // redirect to my teams page:
    window.location.href = "/Member/MyTeams";
  } else {
    NotifToast({
      title: "Something went wrong",
      status: "error",
      toast: toast,
    });
  }
}

function TeamPlate({
  teamInfo,
  topThree,
}: {
  teamInfo: teamInfo;
  topThree: userInfo[];
}) {
  const toast = useToast();
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
            {teamInfo.institution === "none" ? "" : teamInfo.institution}
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

      <div className={styles.bottom}>
        <Button
          className="clicky"
          background={"red.500"}
          color={"white"}
          _hover={{ bg: "red.600" }}
          size={"sm"}
          rightIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
            >
              <path
                fill="white"
                d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
              />
            </svg>
          }
          onClick={() => {
            getOut({
              teamId: teamInfo._id,
              toast,
            });
          }}
        >
          Leave Group
        </Button>
      </div>
    </>
  );
}
export default TeamPlate;
