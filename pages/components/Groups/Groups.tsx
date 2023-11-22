import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { useEffect } from "react";
import styles from "./Groups.module.css";

// implement join button function -> it will add user in the team and team in user

async function userInTeam(teamId: ObjectId) {
  const res = await fetch("/api/teams/join", {
    method: "PUT",
    body: JSON.stringify({ teamId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 200) {
    alert("Joined Successfully");
  } else {
    alert("Something went wrong");
  }
}

async function teamInUser() {
  const res = await fetch("/api/user/join", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 200) {
    alert("Joined Successfully");
  } else {
    alert("Something went wrong");
  }
}

export default function Groups({
  name,
  _id,
  institution,
  totalMembers,
  disabled,
}: {
  institution: string;
  _id: ObjectId;
  name: string;
  totalMembers: number;
  disabled: boolean;
}) {
  let colMain: string = institution === "none" ? "green" : "orange";
  let off = disabled && institution !== "none";

  if (off) {
    colMain = "gray";
  }

  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Stack
          textAlign={"center"}
          p={6}
          color={useColorModeValue("gray.800", "white")}
          align={"center"}
        >
          <Text
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue(`${colMain}.50`, `${colMain}.900`)}
            p={2}
            px={3}
            color={`${colMain}.500`}
            rounded={"full"}
          >
            {institution === "none" ? "Open" : "Institute"}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"4xl"} fontWeight={800} letterSpacing={-2}>
              {name}
            </Text>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue("gray.50", "gray.900")} px={6} py={10}>
          <List spacing={3}>
            <ListItem>
              <ListIcon
                as={ArrowRightIcon}
                color={`${colMain}.400`}
                mb={"0.1rem"}
              />
              Total Members: {totalMembers}
            </ListItem>
          </List>

          <Button
            className={off ? "" : "clicky"}
            mt={10}
            w={"full"}
            bg={`${colMain}.400`}
            color={"white"}
            rounded={"xl"}
            boxShadow={`0 5px 20px 0px ${colMain} `}
            _hover={{
              bg: `${colMain}.500`,
            }}
            _focus={{
              bg: `${colMain}.500`,
            }}
            isDisabled={off}
            onClick={async () => {
              await userInTeam(_id);
              await teamInUser();
            }}
          >
            Join!
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
