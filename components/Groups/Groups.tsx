import createNewTeam from "@/pages/api/createNewTeam";
import { ReceivedTeamDataOnClient } from "@/util/types";
import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  useEditable,
  useToast,
} from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { title } from "process";
import { useEffect, useState } from "react";
import MotionDiv from "../MotionDiv/MotionDiv";
import NotifToast from "../NotifToast/NotifToast";
import styles from "./Groups.module.css";

async function joinTeam(teamId: ObjectId, toast: any) {
  const res = await fetch("/api/teamJoined", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamId }),
  });

  if (res.status === 200) {
    NotifToast({
      title: "Team Joined Successfully",
      status: "success",
      toast: toast,
    });
  } else {
    NotifToast({
      title: "Something went wrong",
      status: "error",
      toast: toast,
    });
  }
}

async function deleteTeam(teamId: ObjectId, toast: any, mutate: Function) {
  if (!teamId) {
    NotifToast({
      title: "Please enter a team name",
      status: "warning",
      toast: toast,
    });
    return;
  }

  const res = await fetch("/api/getTeams", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamId }),
  });

  if (res.status === 200) {
    NotifToast({
      title: "Team deleted successfully",
      status: "success",
      toast: toast,
    });
    mutate();
  } else {
    NotifToast({
      title: "Team deletion failed",
      status: "error",
      toast: toast,
    });
  }
}

function DeleteTeamModal({
  isOpen,
  onOpen,
  onClose,
  mutate,
  toast,
  teamId,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  mutate: Function;
  toast: any;
  teamId: ObjectId;
}) {
  const [isLoading, setIsLoading] = useState(false);
  // const [isInstitutional, setIsInstitutional] = useState(false);
  // const [teamName, setTeamName] = useState("");

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Team</ModalHeader>
        <ModalBody className={styles.modalForm}>
          <div>Are you sure you want to delete this team?</div>
        </ModalBody>

        {/* submit leetcode username: */}
        <ModalFooter>
          <Button
            isLoading={isLoading}
            colorScheme="red"
            onClick={async () => {
              setIsLoading(true);
              await deleteTeam(teamId, toast, mutate);
              setIsLoading(false);
              onClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

async function isMemberOf(teamId: ObjectId) {
  const res = await fetch(`/api/isMemberOf/${teamId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}

export default function Groups({
  teamData,
  mutate,
  disabled,
  transition,
  isAdmin,
}: {
  teamData: ReceivedTeamDataOnClient;
  mutate: () => void;
  disabled: boolean;
  transition: any;
  isAdmin: boolean;
}) {
  let off = teamData.institution !== "none" && disabled;
  let colMain: string = teamData.institution === "none" ? "green" : "orange";

  if (off) {
    colMain = "gray";
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  let [isMember, setIsMember] = useState(false);

  // set the value of isMember:
  useEffect(() => {
    const getIsMember = async () => {
      const res = await isMemberOf(teamData._id);
      setIsMember(res);
    };
    mutate();
    getIsMember();
  }, []);

  if (isAdmin) {
    isMember = true;
    colMain = "teal";
  }

  const {
    isOpen: isDeleteTeamModalOpen,
    onOpen: onDeleteTeamModalOpen,
    onClose: onDeleteTeamModalClose,
  } = useDisclosure();

  const toast = useToast();

  return (
    <MotionDiv
      className={styles.cen}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={transition}
    >
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
            {teamData.institution === "none" ? "Open" : "Institute"}
          </Text>
          <Stack direction={"row"} align={"center"} justify={"center"}>
            <Text fontSize={"4xl"} fontWeight={800} letterSpacing={-2}>
              {teamData.name}
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
              Total Members: {teamData.totalMembers}
            </ListItem>
          </List>

          {isMember ? (
            <Link href={`/Member/MyTeams/${teamData._id}`}>
              <Button
                className={isAdmin ? "clicky" : off ? "" : "clicky"}
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
              >
                Enter
              </Button>
            </Link>
          ) : (
            <Button
              className={isAdmin ? "clicky" : off ? "" : "clicky"}
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
                await joinTeam(teamData._id, toast);
                window.location.href = "/Member/MyTeams";
              }}
            >
              Join!
            </Button>
          )}

          {isAdmin && (
            <Button
              mt={5}
              w={"full"}
              bg={"red.400"} // Set the background color to red
              color={"white"}
              rounded={"xl"}
              boxShadow={`0 5px 20px 0px red`} // Adjust shadow color to red
              _hover={{
                bg: "red.500", // Adjust hover background color to a darker red
              }}
              _focus={{
                bg: "red.500", // Adjust focus background color to a darker red
              }}
              onClick={onDeleteTeamModalOpen}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      <DeleteTeamModal
        isOpen={isDeleteTeamModalOpen}
        onOpen={onDeleteTeamModalOpen}
        onClose={onDeleteTeamModalClose}
        mutate={mutate}
        toast={toast}
        teamId={teamData._id}
      />
    </MotionDiv>
  );
}
