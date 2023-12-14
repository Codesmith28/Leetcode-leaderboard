import { UserCol } from "@/util/types";
import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
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
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import styles from "./ProfileCard.module.css";
import Loading from "./loading";

async function updateInstitution(institution: string) {
  const res = await fetch("/api/updateInstitution", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ institution }),
  });
  const data = await res.json();
  return data;
}

function EditInstitutionModal({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [institution, setInstitution] = useState("none");
  const [loading, setLoading] = useState(false);

  // let institutions = ["DAIICT", "NIRMA", "SEAS", "SVNIT"];

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

      console.log("inst", inst);
      setInstitutions(inst);
    };

    getInstitutions();
  }, []);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size={"sm"}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.modalForm}>
          <div>
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
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="clicky"
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              await updateInstitution(institution);
              setLoading(false);
              onClose();
              window.location.reload();
            }}
          >
            Change
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

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
      setInfo(data);
    };

    getInfo();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (info) {
      setIsLoading(false);
    }
  }, [info]);

  const {
    isOpen: isEditInstitutionOpen,
    onOpen: onEditInstitutionOpen,
    onClose: onEditInstitutionClose,
  } = useDisclosure();

  if (isLoading) {
    return <Loading />;
  }

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
      />
    </Center>
  );
}
