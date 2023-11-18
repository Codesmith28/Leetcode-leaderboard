import { UserCol } from "@/util/types";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";

interface Info {
  username: string;
  email: string;
  institution: string;
  totalSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
}

// get information of the user using the get request:

export default function ProfileCard() {
  const { data: session } = useSession();

  const [info, setInfo] = useState<Info>({
    username: "",
    email: "",
    institution: "",
    totalSolved: 0,
    totalEasy: 0,
    totalMedium: 0,
    totalHard: 0,
  });

  useEffect(() => {
    const getInfo = async () => {
      const res = await fetch("/api/getInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setInfo(data);
    };

    const upDateInfo = async () => {
      const res = await fetch(
        `https://leetcode-api-faisalshohag.vercel.app/${info.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setInfo(data);
    };

    getInfo();
    upDateInfo();
  }, []);

  return (
    <Center>
      <Box
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        textAlign={"center"}
        p={6}
      >
        <Avatar
          size={"xl"}
          src={session?.user.image!}
          mt={-30}
          mb={4}
          pos={"relative"}
        />

        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {session?.user.name!}
        </Heading>

        <Text fontWeight={600} color={"gray.500"} mb={4}>
          {info.username}
        </Text>

        <div className={styles.card}>
          <div className={styles.label}>
            <Heading fontSize={"lg"}>Email: </Heading>
            <div className={styles.txt}>{session?.user.email!}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Institution: </Heading>
            <div className={styles.txt}>{info.institution}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Total solved: </Heading>
            <div className={styles.txt}> {info.totalSolved} </div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Total Easy: </Heading>
            <div className={styles.txt}>{info.totalEasy}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Total Medium: </Heading>
            <div className={styles.txt}>{info.totalMedium}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Total Hard: </Heading>
            <div className={styles.txt}>{info.totalHard}</div>
          </div>
        </div>
      </Box>
    </Center>
  );
}
