import { UserCol } from "@/util/types";
import { InfoIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MotionDiv from "../MotionDiv/MotionDiv";
import styles from "./UserListItem.module.css";

function UserListItem({
  member,
  rank,
  transition,
}: {
  member: UserCol;
  rank: number;
  transition: any;
}) {
  // check if the screen is small
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
        <h1>{member.LCTotalSolved} solved</h1>
      </div>
      <div className={styles.denominations}>
        <Heading size="xs">Easy: {member.LCEasySolved}</Heading>
        <Heading size="xs">Medium: {member.LCMediumSolved} </Heading>
        <Heading size="xs">Hard: {member.LCHardSolved}</Heading>
      </div>
    </div>
  );

  if (isSmallScreen) {
    misc = (
      <Popover placement="left" gutter={0} >
        <PopoverTrigger>
          <IconButton
            className="clicky"
            colorScheme="teal"
            aria-label="info"
            size={"sm"}
            icon={<InfoIcon />}
          />
        </PopoverTrigger>
        <PopoverContent width={"fit-content"}>
          <PopoverArrow />
          <PopoverBody>{denom}</PopoverBody>
        </PopoverContent>
      </Popover>
    );
  } else {
    misc = denom;
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <MotionDiv
      className={styles.main}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={transition}
    >
      {/* rank */}
      <Box className={styles.content}>
        <div className={styles.rank}>
          <h1># {rank}</h1>
        </div>

        {/* Avatar */}
        {isSmallScreen ? (
          <div className={styles.avatar}>
            <Avatar size="md" name={member.name} src={member.image} />
          </div>
        ) : (
          <div className={styles.avatar}>
            <Avatar size="lg" name={member.name} src={member.image} />
          </div>
        )}

        <div className={styles.names}>
          <h1>{member.name}</h1>
          <Link href={`https://leetcode.com/${member.username}`}>
            <h1>@{member.username}</h1>
          </Link>
        </div>

        <div>{misc}</div>
      </Box>
    </MotionDiv>
  );
}

export default UserListItem;
