import { UserCol } from "@/util/types";
import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { link } from "fs";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

interface Props {
  children: React.ReactNode;
}

// post request to upload leetcode username and institution name to database if not already there
async function submitLCUsername(username: string, institution: string) {
  const res = await fetch("/api/submitLCUsername", {
    method: "PUT",
    body: JSON.stringify({
      username: username,
      institution: institution,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
}

// Modal that asks for Leetcode username if not provided
function UsrnModal({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [username, setUsername] = useState("");
  const [institution, setInstitution] = useState("none");
  const [loading, setLoading] = useState(false);

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

  // let institutions = ["DAIICT", "NIRMA", "SEAS", "SVNIT"];

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Some Credentials missing!</ModalHeader>

        <ModalBody className={styles.modalForm}>
          <div>
            <FormControl variant="floating" id="lc-username" isRequired>
              <Input
                placeholder=" "
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <FormLabel>LeetCode Username</FormLabel>
            </FormControl>
          </div>
          <div>
            <Select
              placeholder="Select Institution"
              defaultValue={"none"}
              onChange={(e) => {
                setInstitution(e.target.value);
              }}
            >
              {institutions?.map((inst, index) => (
                <option key={index} value={inst}>
                  {inst}
                </option>
              ))}
            </Select>
          </div>
        </ModalBody>

        {/* submit leetcode username: */}
        <ModalFooter>
          <Button
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              await submitLCUsername(username, institution);
              setLoading(false);
              onClose();
              // reload the page
              window.location.reload();
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// all redirects here:
const Links = ["MyTeams"];

const NavLink = ({ text, linkTo }: { text: string; linkTo: string }) => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={linkTo}
    >
      {text}
    </Box>
  );
};

const navItems: {
  [key: string]: {
    text: string;
    linkTo: string;
  }[];
} = {
  Admin: [
    { text: "MyTeams", linkTo: "/Member/MyTeams" },
    { text: "Manage", linkTo: "/Admin/ManageTeams" },
  ],
  Member: [{ text: "MyTeams", linkTo: "/Member/MyTeams" }],
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    isOpen: isLCOpen,
    onOpen: onLCOpen,
    onClose: onLCClose,
  } = useDisclosure();

  let authBtn;

  const [userInfo, setUserInfo] = useState<UserCol>();

  useEffect(() => {
    const isFirstTime = async () => {
      const res = await fetch("/api/isFirstTime", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.isFirstTime) {
        onLCOpen();
      }
    };

    const getUserInfo = async () => {
      const res = await fetch("/api/getInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUserInfo(data);
    };

    if (session && session.user) {
      isFirstTime();
    }

    getUserInfo();
  }, [session]);

  const myRole = userInfo?.role;

  if (session && session.user) {
    authBtn = (
      <div className={styles.navMenu}>
        <Menu>
          <MenuButton className="clicky">
            <Avatar size={"md"} src={session.user.image!} />
          </MenuButton>
          <MenuList className={styles.menuList} minWidth="100x">
            <Link href={"/Profile"}>
              <MenuItem className={styles.menuItem}>My Profile</MenuItem>
            </Link>
            <MenuItem
              className={styles.menuOut}
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    );
  } else {
    authBtn = (
      <Button
        isLoading={loading}
        onClick={async () => {
          setLoading(true);
          await signIn("google");
          setLoading(false);
        }}
      >
        {loading ? "Signin In..." : "Sign in"}
      </Button>
    );
  }

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        borderRadius="lg"
      >
        <UsrnModal isOpen={isLCOpen} onOpen={onLCOpen} onClose={onLCClose} />
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {session &&
                navItems[myRole!]?.map((link) => (
                  <NavLink
                    key={link.text}
                    text={link.text}
                    linkTo={link.linkTo}
                  />
                ))}
            </HStack>
          </HStack>

          <Link href={"/"} className={styles.title}>
            LeetCode LeaderBoard
          </Link>

          <Flex alignItems={"center"}>{authBtn}</Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack
              bg={"gray.50"}
              className={styles.navBtn}
              as={"nav"}
              spacing={4}
            >
              {session &&
                navItems[myRole!]?.map((link) => (
                  <NavLink
                    key={link.text}
                    text={link.text}
                    linkTo={link.linkTo}
                  />
                ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={3}></Box>
    </>
  );
}
