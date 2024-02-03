import { UserCol } from "@/util/types";
import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Toast,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NotifToast from "../NotifToast/NotifToast";
import styles from "./ProfileCard.module.css";
import Loading from "./loading";

async function updateInstitution(institution: string, toast: any) {
  const res = await fetch("/api/updateInstitution", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ institution }),
  });
  const data = await res.json();

  if (res.status !== 200) {
    NotifToast({
      title: "Error",
      description: data.message,
      status: "error",
      toast: toast,
    });
  } else {
    NotifToast({
      title: "Success",
      description: data.message,
      status: "success",
      toast: toast,
    });

    window.location.reload();
  }
  return data;
}

async function updateUsername(username: string, toast: any) {
  if (username.trim().length === 0) {
    NotifToast({
      title: "Error",
      description: "Username cannot be empty",
      status: "error",
      toast: toast,
    });
    return;
  }

  const res = await fetch("/api/getInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    NotifToast({
      title: "Error",
      description: data.message,
      status: "error",
      toast: toast,
    });
  } else {
    window.location.reload();
  }
}

function EditInstitutionModal({
  isOpen,
  onOpen,
  onClose,
  toast,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toast: any;
}) {
  const [instLoading, setInstLoading] = useState(false);
  const [usrLoading, setUsrLoading] = useState(false);
  const [institution, setInstitution] = useState("none");
  const [username, setUsername] = useState("");

  const [institutions, setInstitutions] = useState<string[]>([]);
  useEffect(() => {
    const getInstitutions = async () => {
      const res = await fetch("/api/getInstitutions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      let inst: string[] = [];
      data?.map((d: any) => {
        inst.push(d.name);
      });

      setInstitutions(inst);
    };

    getInstitutions();
  }, []);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"sm"}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Change Credentials</ModalHeader>
        <ModalCloseButton />

        <ModalBody className={styles.modalForm}>
          <div className={styles.form}>
            <Select
              placeholder="Select Institution"
              defaultValue={"none"}
              onChange={(e) => {
                setInstitution(e.target.value);
              }}
            >
              {institutions?.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </Select>

            <Button
              className="clicky"
              isLoading={instLoading}
              onClick={async () => {
                setInstLoading(true);
                await updateInstitution(institution, toast);
                setInstLoading(false);
                onClose();
              }}
            >
              Change Institution
            </Button>
          </div>

          <div className={styles.form}>
            <FormControl isRequired>
              <Input
                value={username}
                placeholder={"username"}
                size="md"
                onChange={(e) => setUsername(e.target.value.trim())}
                readOnly={false}
              />
            </FormControl>

            <Button
              className="clicky"
              isLoading={usrLoading}
              onClick={async () => {
                setUsrLoading(true);
                await updateUsername(String(username), toast);
                setUsrLoading(false);
                onClose();
              }}
            >
              Change Username
            </Button>
          </div>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default function ProfileCard({ toast }: { toast: any }) {
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
      setInfo(data);
    };

    getInfo();
  }, []);

  const {
    isOpen: isEditInstitutionOpen,
    onOpen: onEditInstitutionOpen,
    onClose: onEditInstitutionClose,
  } = useDisclosure();

  return (
    <Center>
      <Box
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        textAlign={"center"}
        mt={16}
        p={6}
      >
        <Avatar
          size={"xl"}
          src={info.image}
          mt={"-70px"}
          mb={4}
          pos={"relative"}
        />

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
            <div className={styles.labelEdit}>
              <Heading fontSize={"lg"}>Institution: </Heading>
              <IconButton
                className="clicky"
                colorScheme="teal"
                aria-label="edit institution"
                size="xs"
                icon={<EditIcon />}
                top={"1em"}
                onClick={onEditInstitutionOpen}
              />
            </div>
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
      <EditInstitutionModal
        isOpen={isEditInstitutionOpen}
        onOpen={onEditInstitutionOpen}
        onClose={onEditInstitutionClose}
        toast={toast}
      />
    </Center>
  );
}
