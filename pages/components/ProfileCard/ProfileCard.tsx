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
  return (
    <Center>
      <Box
        maxW={"400px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        textAlign={"center"}
      >
        <Avatar
          size={"xl"}
          src={session?.user.image!}
          mt={-50}
          mb={4}
          pos={"relative"}
        />

        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {session?.user.name!}
        </Heading>

        <Text fontWeight={600} color={"gray.500"} mb={4}>
          {session?.user.username!}
        </Text>

        <div className={styles.label}>
          <Heading fontSize={"lg"}>Email:</Heading>
          <div className={styles.txt}>{session?.user.email!}</div>
        </div>

        <div className={styles.label}>
          <Heading fontSize={"lg"}>Institution:</Heading>
          {/* <div className={styles.txt}>{session?.user.institution}</div> */}
        </div>

        <div className={styles.label}>
          <Heading fontSize={"lg"}>Total solved:</Heading>
          <div className={styles.txt}>0</div>
        </div>

        <div className={styles.label}>
          <Heading fontSize={"lg"}>Total Easy:</Heading>
          <div className={styles.txt}>0</div>
        </div>

        <div className={styles.label}>
          <Heading fontSize={"lg"}>Total Medium:</Heading>
          <div className={styles.txt}>0</div>
        </div>

        <div className={styles.label}>
          <Heading fontSize={"lg"}>Total Hard:</Heading>
          <div className={styles.txt}>0</div>
        </div>
      </Box>
    </Center>
  );
}
