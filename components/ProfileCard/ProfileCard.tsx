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

// get information of the user using the get request:

export default function ProfileCard() {
  const { data: session } = useSession();

  const [info, setInfo] = useState<UserCol>({
    image: session?.user.image!,
    username: session?.user.username!,
    email: session?.user.email!,
    institution: "",
    LCTotalSolved: 0,
    LCEasySolved: 0,
    LCMediumSolved: 0,
    LCHardSolved: 0,
    ranking: 0,
    role: session?.user.role!,
    name: session?.user.name!,
    teams: [],
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
      console.log(data);
      setInfo(data);
    };

    getInfo();
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
        <Avatar size={"xl"} src={info.image} mt={-30} mb={4} pos={"relative"} />

        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {info.name}
        </Heading>

        <Text fontWeight={600} color={"gray.500"} mb={4}>
          {info.username}
          <br />
          Ranking: {info.ranking}
        </Text>

        <div className={styles.card}>
          <div className={styles.label}>
            <Heading fontSize={"lg"}>Email: </Heading>
            <div className={styles.txt}>{info.email}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Institution: </Heading>
            <div className={styles.txt}>{info.institution}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Total solved: </Heading>
            <div className={styles.txt}> {info.LCTotalSolved} </div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Easy Solved: </Heading>
            <div className={styles.txt}>{info.LCEasySolved}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Medium Solvedum: </Heading>
            <div className={styles.txt}>{info.LCMediumSolved}</div>
          </div>

          <div className={styles.label}>
            <Heading fontSize={"lg"}>Hard Solved: </Heading>
            <div className={styles.txt}>{info.LCHardSolved}</div>
          </div>
        </div>
      </Box>
    </Center>
  );
}
