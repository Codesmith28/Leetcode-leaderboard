import { InfoIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Heading,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import React, { useEffect, useState } from "react";
import styles from "./UserListItem.module.css";

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

function UserListItem({ member, rank }: { member: userInfo; rank: number }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 767); // Adjust the breakpoint as needed
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // component for the button or the denominations
  let misc;

  let denom;
  denom = (
    <div className={styles.misc}>
      <div className={styles.totalSolved}>
        <h1>{member.totalSolved}</h1>
      </div>
      <div className={styles.denominations}>
        <Heading size="xs">Easy: {member.easySolved}</Heading>
        <Heading size="xs">Medium: {member.mediumSolved} </Heading>
        <Heading size="xs">Hard: {member.hardSolved}</Heading>
      </div>
    </div>
  );

  if (isSmallScreen) {
    misc = (
      <IconButton
        className="clicky"
        colorScheme="teal"
        aria-label="info"
        size={"sm"}
        icon={<InfoIcon />}
      />
    );
  } else {
    misc = denom;
  }

  return (
    <Box bg={useColorModeValue("gray.200", "gray.900")} className={styles.main}>
      {/* rank */}
      <Box className={styles.content}>
        <div className={styles.rank}>
          <h1># {rank}</h1>
        </div>

        {/* Avatar */}
        {isSmallScreen ? (
          <div className={styles.avatar}>
            <Avatar
              size="md"
              name="Prosper Otemuyiwa"
              src="https://bit.ly/prosper-baba"
            />
          </div>
        ) : (
          <div className={styles.avatar}>
            <Avatar
              size="lg"
              name="Prosper Otemuyiwa"
              src="https://bit.ly/prosper-baba"
            />
          </div>
        )}

        <div className={styles.names}>
          <h1>{member.name}</h1>
          <h1>@{member.username}</h1>
        </div>

        <div>{misc}</div>
      </Box>
    </Box>
  );
}

export default UserListItem;
