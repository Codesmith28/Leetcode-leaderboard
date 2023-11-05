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
import styles from "./ProfileCard.module.css";

export default function ProfileCard() {
  const { data: session } = useSession();

  // make an array of all data from the user:
  

  return (
    <Center>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        textAlign={"center"}
        p={12}
      >
        <Avatar
          size={"xl"}
          src={session?.user.image!}
          mt={-50}
          mb={4}
          pos={"relative"}
        />
        {/* name */}
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {session?.user.name!}
        </Heading>
        {/* user name */}
        <Text fontWeight={600} color={"gray.500"} mb={4}>
          @lindsey_jam3s
        </Text>

        <div className={styles.label}>
          <Heading fontSize={"lg"}>Hi:</Heading>
          <Text fontSize={"lg"}>Hello</Text>
        </div>

        {/* 
        Email
        Institution
        Total solved
        Total Easy
        Total Medium
        Total Hard
        */}
      </Box>
    </Center>
  );
}
